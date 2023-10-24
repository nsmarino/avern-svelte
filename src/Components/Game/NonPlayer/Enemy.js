import * as THREE from 'three';
import gsap from "gsap"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as YUKA from "yuka"
import GameplayComponent from '../../_Component';
import { 
  generateCapsuleCollider, 
  checkCapsuleCollision, 
  randomIntFromInterval,
  findClosestPointOnMeshToPoint,
  updateRotationToFacePoint,
} from '../../../helpers';
import Body from '../Player/Body';
import FollowCamera from '../Player/FollowCamera';
import zombieBow from "../../../../assets/monsters/bow-large.gltf"
import zombieSword from "../../../../assets/monsters/sword-large.gltf"
import Vitals from '../Player/Vitals';
import Actions from '../Player/Actions';
import ItemOnMap from './ItemOnMap';
import Targetable from './Targetable';
import Targeting from '../Player/Targeting';
import {get} from 'svelte/store'

class Enemy extends GameplayComponent {
  constructor(gameObject, spawnPoint) {
    super(gameObject)
    this.gameObject = gameObject
    this.gameObject.transform.position.copy(spawnPoint.position)

    // Array of vectors for enemy to patrol thru
    this.patrolPoints = []
    this.patrolIndex = 0

    if (spawnPoint.children.length > 0) {
      for (const child of spawnPoint.children) {
        const worldPos = child.getWorldPosition(new THREE.Vector3())
        this.patrolPoints.push(worldPos)
      }
      this.gameObject.transform.position.copy(this.patrolPoints[0])
      this.startingBehavior = "patrol"
    } else {
      this.gameObject.transform.position.copy(spawnPoint.position)
      this.startingBehavior = "idle"
    }
  
    this.enemyType = spawnPoint.userData.label

    this.bar = document.createElement("div")
    this.innerBar = document.createElement("div")
    this.bar.classList.add("enemy-bar")
    this.innerBar.classList.add("inner-enemy-bar")

    this.bar.appendChild(this.innerBar)

    document.body.appendChild(this.bar)
    gsap.set(this.bar, { opacity: 0})

    this.numbersContainer = document.createElement("div")
    this.numbersContainer.classList.add("numbers-container")
    document.body.appendChild(this.numbersContainer)

    this.isTargeted = false

    switch(this.enemyType) {
      case "bow":
        this.initialHealth = 65
        this.health = 65
            break;
      case "sword":
        this.initialHealth = 100
        this.health = 100
        break;
    }

    this.prevAngle = null
    this.originalSpawnPoint = spawnPoint

    Avern.State.Enemies.push(this.gameObject)

    this.behavior = this.startingBehavior
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.patrolSpeed = 2
    this.pursueSpeed = 3.5
    this.lerpFactor = 0.2
    this.path = null
    this.maxWanderDistance = 15
    this.prevPlayerPosition = new THREE.Vector3()

    const initFromGLTF = async () => {
      switch(this.enemyType) {
        case "bow":
          this.body = zombieBow
          break;
        case "sword":
          this.body = zombieSword
          break;
      }
      this.gltf = await new GLTFLoader().loadAsync(this.body)
      this.gltf.scene.name = gameObject.name

      gameObject.transform.add(this.gltf.scene)
      this.gltf.scene.traverse(child => {
        child.castShadow = true;
        child.frustumCulled = false;
    })

      // COLLISION
      this.capsuleBottom = this.gltf.scene.getObjectByName("capsule-bottom")
      this.capsuleTop = this.gltf.scene.getObjectByName("capsule-top")
      this.capsuleRadius = this.gltf.scene.getObjectByName("capsule-radius")

      this.colliderCapsule = generateCapsuleCollider(
        this.capsuleBottom,
        this.capsuleTop,
        this.capsuleRadius
      )
      this.startWorldPos = new THREE.Vector3()
      this.endWorldPos = new THREE.Vector3()
  
      gameObject.transform.add(this.colliderCapsule.body)

      this.visionStart = this.gltf.scene.getObjectByName("vision-start")
      this.visionEnd = this.gltf.scene.getObjectByName("vision-end")
      this.visionRadius = this.gltf.scene.getObjectByName("vision-radius")
      this.visionCapsule = generateCapsuleCollider(
        this.visionStart,
        this.visionEnd,
        this.visionRadius
      )
      this.visionStartWorldPos = new THREE.Vector3()
      this.visionEndWorldPos = new THREE.Vector3()

      // Anims
      this.mixer = new THREE.AnimationMixer( this.gltf.scene );

      this.clips = this.gltf.animations
      switch (this.startingBehavior) {
        case "wander":
        case "patrol":
        case "pursue":
          this.action = this.mixer.clipAction(THREE.AnimationClip.findByName(this.clips, "WALK"))
          break;
        case "idle":
          this.action = this.mixer.clipAction(THREE.AnimationClip.findByName(this.clips, "IDLE"))
          break;
      }

      this.idle = this.mixer.clipAction(
        THREE.AnimationClip.findByName(this.clips, "IDLE")
      )
      this.walk = this.mixer.clipAction(
          THREE.AnimationClip.findByName(this.clips, "WALK")
      )
      this.death = this.mixer.clipAction(
          THREE.AnimationClip.findByName(this.clips, "DEATH")
      )
      this.death.setLoop(THREE.LoopOnce)
      this.death.clampWhenFinished = true


      this.reactLarge = this.mixer.clipAction(
          THREE.AnimationClip.findByName(this.clips, "REACT_LARGE")
      )
      this.reactLarge.setLoop(THREE.LoopOnce)

      this.attackRange = null

      switch(this.enemyType) {
        case "bow":
          this.attack = this.mixer.clipAction(
            THREE.AnimationClip.findByName(this.clips, "SHOOT")
          )
          this.rangeWidth = 24

          this.actionRange = 45
          this.crucialFrame = 80
          break;
        case "sword":
          this.attack = this.mixer.clipAction(
            THREE.AnimationClip.findByName(this.clips, "SLASH")
          )
          this.attack.setDuration(2.5)
          this.rangeWidth = 4

          this.actionRange = 3
          this.crucialFrame = 24
          break;
      }
      this.attack.setLoop(THREE.LoopOnce)
      this.attack.clampWhenFinished = true

      this.mixer.addEventListener('finished', this.onMixerFinish.bind(this))

      this.fadeIntoAction(this.action,0)

      this.targetingTriangle = new THREE.Triangle()

      this.frontDirection = new THREE.Vector3(0, 0, -1); // Negative Z direction for front
      this.leftDirection = new THREE.Vector3(-1, 0, 0); // Negative X direction for left
      this.rightDirection = new THREE.Vector3(1, 0, 0); // Positive X direction for right

      this.tempLeft = new THREE.Vector3()
      this.tempRight = new THREE.Vector3()
      this.tempFront = new THREE.Vector3()

      this.tempLeft.copy(this.leftDirection).multiplyScalar(this.rangeWidth)
      this.tempRight.copy(this.rightDirection).multiplyScalar(this.rangeWidth)
      this.tempFront.copy(this.frontDirection).multiplyScalar(-this.actionRange)

      this.triangleA = new THREE.Object3D()
      this.gameObject.transform.add(this.triangleA)
      this.triangleA.z += 1

      this.triangleB = new THREE.Object3D()
      this.gameObject.transform.add(this.triangleB)
      this.triangleB.position.add(this.tempLeft).add(this.tempFront);

      this.triangleC = new THREE.Object3D()
      this.gameObject.transform.add(this.triangleC)
      this.triangleC.position.add(this.tempRight).add(this.tempFront);
      this.gameObject.transform.rotation.y = spawnPoint.rotation.y
    }
    initFromGLTF()
  }

  fadeIntoAction(newAction, duration) {
    if (this.current_action) {
        this.current_action.fadeOut(duration);
    }
    this.action = newAction
    this.action.reset();
    this.action.fadeIn(duration);
    this.action.play();
    this.current_action = this.action;
  }

  onMixerFinish(e) {
    if (e.action == this.attack) {
        if (this.behavior=="die_lol") return
        this.behavior = "pursue"
        this.fadeIntoAction(this.walk,0.1)
        this.crucialFrameSent = false
    }
    if (e.action == this.death) {

      // chance of dropping healing flask
      const randomInt = randomIntFromInterval(1,3)
      if (randomInt===1 && (get(Avern.Store.player).flasks < 5)) {
        const itemOnMap = Avern.GameObjects.createGameObject(Avern.State.scene, `${this.gameObject.name}-item`)
        const itemContent = Avern.Content.items.find(i => i.label === "healing-flask")
        itemOnMap.addComponent(ItemOnMap, this.gameObject.transform, itemContent)
        itemOnMap.canBeTargeted = true
        itemOnMap.addComponent(Targetable, false, 1)
        itemOnMap.getComponent(ItemOnMap).attachObservers(itemOnMap)
        itemOnMap.getComponent(Targetable).attachObservers(itemOnMap)
      }

      setTimeout(() => {
        this.removeFromScene()
      }, 1000)
    }
  }
  
  removeFromScene() {
    this.gameObject.removeFromScene()
    this.gameObject.sleep = true
    this.bar.style.display="none"
  }

  checkTarget(){
    if (!Avern.Player || !this.targetingTriangle) return;
    const targetPosition = Avern.Player.transform.position
    this.targetingTriangle.set(this.triangleA.getWorldPosition(new THREE.Vector3()), this.triangleB.getWorldPosition(new THREE.Vector3()), this.triangleC.getWorldPosition(new THREE.Vector3()))
    // this.triangleA.getWorldPosition(this.mesh.position)
    // this.triangleB.getWorldPosition(this.mesh2.position)
    // this.triangleC.getWorldPosition(this.mesh3.position)

    return this.targetingTriangle.containsPoint(targetPosition)
  }

  update(delta){
    if (Avern.State.worldUpdateLocked == true) return

    switch(this.behavior) {
      case "idle":
          break;
      case "patrol":
          this.followPatrolPath(delta)
          break;
      case "pursue":
          this.followPursuePath(delta)
          break;
      case "attack":
        if (!this.crucialFrameSent) updateRotationToFacePoint(this.gameObject.transform, Avern.Player.transform.position, this.lerpFactor)

        if (Math.floor(this.action.time * 30) >= this.crucialFrame && !this.crucialFrameSent) {
          this.crucialFrameSent = true;
          if(!Avern.State.playerDead && this.checkTarget()) {
            switch(this.enemyType) {
              case "sword":
                this.emitSignal("monster_attack", {damage: 25, percentage: 0.5})
                break;
              case "bow":
                const projectileDestination = new THREE.Vector3().copy(Avern.Player.transform.position)
                projectileDestination.y - 2.5
                this.emitSignal("launch_projectile", {
                  destination: projectileDestination,
                  radius: 1,
                  speed: 33,
                })
                break;
            }
          }
        }
        break;
    }

    if (this.mixer) this.mixer.update(delta)
    if (this.behavior=="die_lol") return

    if (this.colliderCapsule) {
      this.capsuleBottom.getWorldPosition(this.startWorldPos)
      this.capsuleTop.getWorldPosition(this.endWorldPos)

      this.colliderCapsule.segment.start.copy(this.startWorldPos)
      this.colliderCapsule.segment.end.copy(this.endWorldPos)
      
      if (Avern.Player) {
        const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
        if (collision.isColliding) {
          this.emitSignal("capsule_collide", {collision, capsule: this.colliderCapsule})
        }
      }
      this.emitSignal("has_collider", {collider: this.colliderCapsule, offsetY: 2})
    }

    if (this.visionCapsule) {
      this.visionStart.getWorldPosition(this.visionStartWorldPos)
      this.visionEnd.getWorldPosition(this.visionEndWorldPos)

      this.visionCapsule.segment.start.copy(this.visionStartWorldPos)
      this.visionCapsule.segment.end.copy(this.visionEndWorldPos)

      if (Avern.Player) {
        const visionCollision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.visionCapsule)
        if (visionCollision.isColliding && (this.behavior=="wander" || this.behavior=="idle" || this.behavior=="patrol")) {
          if (this.behavior=="idle") this.fadeIntoAction(this.walk, 0.1)

          if (this.enemyType=="sword") {
            Avern.Sound.alert2Handler.currentTime = .4
            Avern.Sound.alert2Handler.play()   
            } else {
              Avern.Sound.alertHandler.currentTime = 0
              Avern.Sound.alertHandler.play()   
            }

          this.behavior="pursue"
        }
      }
    }
  }

  followPatrolPath(deltaTime) {
    const destination = this.patrolPoints[this.patrolIndex]
    if (!destination) return
    if (this.gameObject.transform.position.distanceTo(destination) < 0.5) {
        this.patrolIndex = this.patrolPoints[this.patrolIndex + 1] ? this.patrolIndex + 1 : 0
        return
    } 

      if (!this.path || this.path.length===0) {
          const path = Avern.yukaNavmesh.findPath(new YUKA.Vector3().copy(this.gameObject.transform.position), new YUKA.Vector3().copy(destination))
          this.path = path
      }
      if (!this.path || this.path.length===0) return;
      let targetPos = this.path[0];

      if (!targetPos) return
      this.velocity = new THREE.Vector3().copy(targetPos.clone().sub( this.gameObject.transform.position ));
      updateRotationToFacePoint(this.gameObject.transform, targetPos, this.lerpFactor)
      if (this.velocity.lengthSq() > 0.1 ) {
        this.velocity.normalize();
        
      // Move to next waypoint
        this.gameObject.transform.position.add( this.velocity.multiplyScalar( deltaTime * this.patrolSpeed ) );
        const closestPoint = findClosestPointOnMeshToPoint(Avern.State.env, this.gameObject.transform.position)
        if ( closestPoint) this.gameObject.transform.position.copy(closestPoint)          
      } else {
        this.path.shift();
      }
  }

  followPursuePath(deltaTime) {
    // we want destination to be a point on the surface underneath player to account for jump etc
    const playerPosition = Avern.Player.transform.position
    const groundRaycast = new THREE.Raycaster(playerPosition, new THREE.Vector3(0, -1, 0))
    groundRaycast.firstHitOnly = true
    const destination = groundRaycast.intersectObject(Avern.State.collider)[0] ? groundRaycast.intersectObject(Avern.State.collider)[0].point : null

    if (!destination) return
    if (this.checkTarget() && this.gameObject.transform.position.distanceTo(destination) < this.actionRange) {
        this.behavior = "attack"
        this.fadeIntoAction(this.attack, 0)
        return
    } else {
        if (this.prevPlayerPosition.distanceTo(destination) > 0.05 || !this.path) {
            const path = Avern.yukaNavmesh.findPath(new YUKA.Vector3().copy(this.gameObject.transform.position), new YUKA.Vector3().copy(destination))
            this.path = path
        }
        if (!this.path) return;
        // can probably do a check here to decide whether to use [0] or [1]
        let targetPosition = this.path[1];

        if (!this.path[1]) return
        this.velocity = new THREE.Vector3().copy(targetPosition.clone().sub( this.gameObject.transform.position ));
        updateRotationToFacePoint(this.gameObject.transform, targetPosition, this.lerpFactor)
        if (this.velocity.lengthSq() > 0.1 ) {
          this.velocity.normalize();
          // Move to next waypoint
          this.gameObject.transform.position.add( this.velocity.multiplyScalar( deltaTime * this.pursueSpeed ) );
          const closestPoint = findClosestPointOnMeshToPoint(Avern.State.env, this.gameObject.transform.position)
          if ( closestPoint) this.gameObject.transform.position.copy(closestPoint)          
        } else {
          this.path.shift();
        }
        this.prevPlayerPosition.copy(destination)
    }
  }

  handleDeath() {
    this.behavior = "die_lol"
    Avern.Sound.enemyDieHandler.currentTime = 0
    Avern.Sound.enemyDieHandler.play()   
    // This should only emit signal (perhaps a more specific enemy_death signal?); target logic should be handled in "Targetable" component
    this.onSignal("clear_target")
    this.emitSignal("clear_target", {visible: false, dead: true, id: this.gameObject.name})
    Avern.State.Enemies = Avern.State.Enemies.filter(enem => enem.name !== this.gameObject.name)
    this.dead = true
    Avern.Store.player.update(player => {
      return {
        ...player,
        xp: player.xp + 80
      }
    })
    this.fadeIntoAction(this.death, 0.2)
  }

  onSignal(signalName, data={}) {
    switch(signalName) {
      case "set_target":
        if (data.id !== this.gameObject.name && this.isTargeted) {
          this.isTargeted = false
          gsap.set(this.bar, { opacity: 0})
        } else if (data.id === this.gameObject.name) {
          this.isTargeted = true
          gsap.set(this.bar, { opacity: 1})
        }
        break;

      case "targeted_object":
        const minDistance = 10; // Minimum distance for scaling
        const maxDistance = 100; // Maximum distance for scaling
        const scaleFactor = THREE.MathUtils.clamp(
          1 - (data.distanceToCamera - minDistance) / (maxDistance - minDistance),
          0.1, // Minimum scale factor
          1  // Maximum scale factor
        );
        const translateX = data.x;
        const translateY = data.y;
        this.bar.style.display="block"
        this.bar.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
        this.numbersContainer.style.display="block"
        this.numbersContainer.style.transform = `translate(50%, 50%) translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
        break;

      case "receive_direct_attack":
        if (this.isTargeted===true) {
          Avern.Sound.thudHandler.currentTime = 0.1
          Avern.Sound.thudHandler.play()   

          if (data.generate === true) {
            Avern.Store.player.update(player => {
              const updatedPlayer = {
                ...player,
                energy: player.energy + 20 >= 100 ? 100 : player.energy + 20
        
              }
              return updatedPlayer
            })            
          }

          if (this.behavior === "wander" || this.behavior === "patrol") {
            this.path = null
            this.behavior = "pursue"
            if (this.enemyType=="sword") {
              Avern.Sound.alert2Handler.currentTime = 0.4
              Avern.Sound.alert2Handler.play()   
              } else {
                Avern.Sound.alertHandler.currentTime = 0
                Avern.Sound.alertHandler.play()   
              }
            }
          if (this.behavior=="idle") {
            this.path = null
            this.behavior = "pursue"
            if (this.enemyType=="sword") {
              Avern.Sound.alert2Handler.currentTime = 0.4
              Avern.Sound.alert2Handler.play()   
              } else {
                Avern.Sound.alertHandler.currentTime = 0
                Avern.Sound.alertHandler.play()   
              }   
            this.fadeIntoAction(this.walk, 0.1)
          }
          this.health -= data.damage
          this.innerBar.style.width = this.health > 0 ? `${(this.health / this.initialHealth) * 100}%` : 0

          const damageNumber = document.createElement('span')
          damageNumber.innerHTML = Math.floor(data.damage)
          this.numbersContainer.appendChild(damageNumber)
          setTimeout(()=>damageNumber.remove(), 2000)

          if (this.health <= 0) {
            this.handleDeath()
          } else {
            if (this.behavior !== "attack") {
              this.reactLarge.reset();
              this.reactLarge.fadeIn(0.2);
              this.reactLarge.play();
            }
          }
        }
        break;
      case "reset_stage":
        if (this.dead) {
          Avern.State.scene.add(this.gameObject.transform)
          Avern.State.Enemies.push(this.gameObject)
          this.gameObject.sleep = false
          this.dead = false
        }
        this.isTargeted = false;
        this.health = this.initialHealth
        this.innerBar.style.width = `100%`
        this.behavior = this.startingBehavior
        this.gameObject.transform.position.copy(this.originalSpawnPoint.position)
        this.gameObject.transform.rotation.y = this.originalSpawnPoint.rotation.y

        if (this.startingBehavior=="wander")this.fadeIntoAction(this.walk, 0.1)
        if (this.startingBehavior=="idle")this.fadeIntoAction(this.idle, 0.1)
        
        this.emitSignal("clear_target", {visible: false, id: this.gameObject.name})
        break;

      case "clear_target":
        this.isTargeted = false
        gsap.set(this.bar, { opacity: 0})
        break;
    }
  }

  attachObservers(parent) {
    for (const component of parent.components) {
      if (!(component instanceof Enemy)) {
        this.addObserver(component)
      }
    }
    this.addObserver(Avern.Player.getComponent(Targeting))
    this.addObserver(Avern.Player.getComponent(Body))
    this.addObserver(Avern.Player.getComponent(FollowCamera))
    this.addObserver(Avern.Player.getComponent(Vitals))
    this.addObserver(Avern.Player.getComponent(Actions))
  }
}

export default Enemy