import * as THREE from 'three';
import gsap from "gsap"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import GameplayComponent from '../../_Component';
import { generateCapsuleCollider, checkCapsuleCollision, distancePointToLine, randomIntFromInterval } from '../../../helpers';
import Body from '../Player/Body';
import FollowCamera from '../Player/FollowCamera';
import zombieBow from "../../../../assets/monsters/zombie-bow-2.gltf"
import zombieSword from "../../../../assets/monsters/zombie-sword-2.gltf"
import Vitals from '../Player/Vitals';
import Actions from '../Player/Actions';
import ItemOnMap from './ItemOnMap';
import Targeting from '../Player/Targeting';
import Notices from '../../Interface/Notices';

class Enemy extends GameplayComponent {
  constructor(gameObject, spawnPoint) {
    super(gameObject)
    this.gameObject = gameObject
    this.gameObject.transform.position.copy(spawnPoint.position)
  
    this.enemyType = spawnPoint.userData.label
    this.startingBehavior = spawnPoint.userData.behavior
    // this.HELPER = Avern.PATHFINDINGHELPER
    // Avern.State.scene.add(this.HELPER)

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

    this.orderContainer = document.createElement("div")
    this.orderContainer.classList.add("order-container")
    document.body.appendChild(this.orderContainer)

    this.initialHealth = 55
    this.health = 55

    this.prevAngle = null
    this.originalSpawnPoint = spawnPoint

    Avern.State.Enemies.push(this.gameObject)
    this.gameObject.transform.canBeTargeted = true

    this.isTargeted = false

    this.behavior = this.startingBehavior
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.speed = 2
    this.targetGroup = Avern.PATHFINDING.getGroup(Avern.pathfindingZone, spawnPoint.position);
    this.lerpFactor = 0.2
    this.originNode = Avern.PATHFINDING.getClosestNode(spawnPoint.position, Avern.pathfindingZone, this.targetGroup)
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
      // this.gameObject.transform.add(this.visionCapsule.spine)
      this.visionStartWorldPos = new THREE.Vector3()
      this.visionEndWorldPos = new THREE.Vector3()

      const torusGeometry = new THREE.TorusGeometry( 1, 0.02, 12, 40 ); 
      const torusMaterial = new THREE.MeshBasicMaterial( { color: 0x56FBA1 } ); 
      this.ring = new THREE.Mesh( torusGeometry, torusMaterial );
      this.ring.rotation.x = Math.PI / 2
      this.ring.position.y+=1
      this.gameObject.transform.add( this.ring );
      this.ring.visible = false

      // Anims
      this.mixer = new THREE.AnimationMixer( this.gltf.scene );

      this.clips = this.gltf.animations
      switch (this.startingBehavior) {
        case "wander":
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

      this.reactSmall = this.mixer.clipAction(
          THREE.AnimationClip.findByName(this.clips, "REACT_SMALL")
      )
      this.reactSmall.setLoop(THREE.LoopOnce)

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
          this.actionRange = 18
          this.crucialFrame = 85
          break;
        case "sword":
          this.attack = this.mixer.clipAction(
            THREE.AnimationClip.findByName(this.clips, "SLASH")
          )
          this.attack.setDuration(2.5)

          this.actionRange = 3
          this.crucialFrame = 18
          break;
      }
      this.attack.setLoop(THREE.LoopOnce)
      this.attack.clampWhenFinished = true

      this.mixer.addEventListener('finished', this.onMixerFinish.bind(this))

      this.fadeIntoAction(this.action,0)

      // Abstract this out once functional:
      this.targetingTriangle = new THREE.Triangle()

      this.frontDirection = new THREE.Vector3(0, 0, -1); // Negative Z direction for front
      this.leftDirection = new THREE.Vector3(-1, 0, 0); // Negative X direction for left
      this.rightDirection = new THREE.Vector3(1, 0, 0); // Positive X direction for right

      this.tempLeft = new THREE.Vector3()
      this.tempRight = new THREE.Vector3()
      this.tempFront = new THREE.Vector3()

      this.rangeWidth = 4

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


      // TO BE USED FOR FIXING ISSUES WITH ENEMY ATTACK TRIANGLES:
      // this.mesh = new THREE.Mesh(
      //     new THREE.SphereGeometry(),
      //     new THREE.MeshBasicMaterial()
      // );
      // this.gameObject.transform.parent.add(this.mesh)

      // this.mesh2 = new THREE.Mesh(
      //     new THREE.SphereGeometry(),
      //     new THREE.MeshBasicMaterial()
      // );
      // this.gameObject.transform.parent.add(this.mesh2)

      // this.mesh3 = new THREE.Mesh(
      //     new THREE.SphereGeometry(),
      //     new THREE.MeshBasicMaterial()
      // );
      // this.gameObject.transform.parent.add(this.mesh3)
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
      setTimeout(() => {
        // add item
        const randomInt = randomIntFromInterval(1,4)
        console.log(randomInt)
        if (randomInt===1) {
          const itemOnMap = Avern.GameObjects.createGameObject(Avern.State.scene, `${this.gameObject.name}-item`)
          const itemContent = Avern.Content.itemsOnMap.find(i => i.label === "healing-flask")
          itemOnMap.addComponent(ItemOnMap, this.gameObject.transform, itemContent)
          itemOnMap.getComponent(ItemOnMap).attachObservers()
        }

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

  updateRotationToFacePoint(object, targetPoint, lerpFactor) {
    // Calculate the direction from the object's position to the target point
    var direction = targetPoint.clone().sub(object.position);
    
    // Calculate the angle between the direction vector and the positive Z-axis
    var targetAngle = Math.atan2(direction.x, direction.z);
    
    // Wrap both angles to the range [-π, π] for proper interpolation
    var currentAngle = object.rotation.y;
    if (currentAngle > Math.PI) {
      currentAngle -= 2 * Math.PI;
    } else if (currentAngle < -Math.PI) {
      currentAngle += 2 * Math.PI;
    }
    
    // Calculate the angular distance between current and target angles
    var angularDistance = targetAngle - currentAngle;
    
    // Choose the shortest angular distance (clockwise or counterclockwise)
    if (angularDistance > Math.PI) {
      angularDistance -= 2 * Math.PI;
    } else if (angularDistance < -Math.PI) {
      angularDistance += 2 * Math.PI;
    }
    
    // Apply lerp to interpolate between the current angle and the target angle
    var newAngle = currentAngle + angularDistance * lerpFactor;
    
    // Update the rotation of the object
    object.rotation.y = newAngle;
}

  update(delta){
    if (Avern.State.worldUpdateLocked == true) return

    if (this.colliderCapsule) {
      const { x, y, distanceToCamera, visible } = this.getScreenCoordinatesAndDistance();
      const losDistance = Avern.Player.getComponent(Body).visionCapsule ? distancePointToLine(this.gameObject.transform.position, Avern.Player.getComponent(Body).visionCapsule.segment, Avern.Player.transform) : null

      if (!this.dead) this.emitSignal("target_visible", {
        visible, 
        id: this.gameObject.name, 
        proximity: x,
        y,
        losDistance
      })
      if(this.isTargeted) this.emitSignal("targeted_object", {object: this.gameObject})

      if (visible) {
        const minDistance = 10; // Minimum distance for scaling
        const maxDistance = 100; // Maximum distance for scaling
        const scaleFactor = THREE.MathUtils.clamp(
          1 - (distanceToCamera - minDistance) / (maxDistance - minDistance),
          0.1, // Minimum scale factor
          1  // Maximum scale factor
        );
    
        const translateX = x;
        const translateY = y;
        this.bar.style.display="block"
        this.bar.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
        this.numbersContainer.style.display="block"
        this.numbersContainer.style.transform = `translate(50%, 50%) translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
      } else {
        this.bar.style.display="none"
        this.numbersContainer.style.display="none"
      }      
    }



    switch(this.behavior) {
      case "idle":
          break;
      case "wander":
          this.followWanderPath(delta)
          break;
      case "pursue":
          this.followPursuePath(delta)
          break;
      case "attack":
        if (!this.crucialFrameSent) this.updateRotationToFacePoint(this.gameObject.transform, Avern.Player.transform.position, this.lerpFactor)

        if (Math.floor(this.action.time * 30) >= this.crucialFrame && !this.crucialFrameSent) {
          this.crucialFrameSent = true;

          if(!Avern.State.playerDead && this.checkTarget()) {
            this.emitSignal("monster_attack", {damage: 20, percentage: 0.5})
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
    }

    if (this.visionCapsule) {
      this.visionStart.getWorldPosition(this.visionStartWorldPos)
      this.visionEnd.getWorldPosition(this.visionEndWorldPos)

      this.visionCapsule.segment.start.copy(this.visionStartWorldPos)
      this.visionCapsule.segment.end.copy(this.visionEndWorldPos)

      if (Avern.Player) {
        const visionCollision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.visionCapsule)
        if (visionCollision.isColliding && (this.behavior=="wander" || this.behavior=="idle")) {
          if (this.behavior=="idle") this.fadeIntoAction(this.walk, 0.1)
          this.behavior="pursue"
        }
      }
    }
  }

  followWanderPath(deltaTime) {
    if ( !this.path || !(this.path||[]).length ) {
      this.resetPath()
      return;
    }
  
    let targetPosition = this.path[ 0 ];
    this.velocity = targetPosition.clone().sub( this.gameObject.transform.position );
    this.updateRotationToFacePoint(this.gameObject.transform, targetPosition, this.lerpFactor)
  
    if (this.velocity.lengthSq() > 0.1) {
      this.velocity.normalize();
      // Move to next waypoint
      this.gameObject.transform.position.add( this.velocity.multiplyScalar( deltaTime * this.speed ) );
    } else {
      // Remove node from the path we calculated
      this.path.shift();
    }
  }

  resetPath() {
    const targetGroup = Avern.PATHFINDING.getGroup(Avern.pathfindingZone, this.gameObject.transform.position);

    const closestNode = Avern.PATHFINDING.getClosestNode(this.gameObject.transform.position, Avern.pathfindingZone, targetGroup)
    const randomNode = this.getWanderTarget(this.originNode.centroid, Avern.pathfindingZone, targetGroup)
    const path = Avern.PATHFINDING.findPath(closestNode.centroid, randomNode, Avern.pathfindingZone, targetGroup);
    this.path = path
  }
  getWanderTarget(origin, zone, group) {
    let randomNode = Avern.PATHFINDING.getRandomNode(zone, group)
    const distance = origin.distanceTo(randomNode)
    if (distance > this.maxWanderDistance) {
      randomNode = this.getWanderTarget(origin, zone, group)
    }
    return randomNode
  }

  followPursuePath(deltaTime) {
    const destination = Avern.Player.transform.position

    if (this.checkTarget() && this.gameObject.transform.position.distanceTo(destination) < this.actionRange) {
        this.behavior = "attack"
        this.fadeIntoAction(this.attack, 0)
        return
    } else {
        // Set path anytime player moves:
        if (this.prevPlayerPosition.distanceTo(destination) > 0.05 || !this.path) {

            const targetGroup = Avern.PATHFINDING.getGroup(Avern.pathfindingZone, this.gameObject.transform.position);

            const closestNode = Avern.PATHFINDING.getClosestNode(this.gameObject.transform.position, Avern.pathfindingZone, targetGroup)
            const destinationNode = Avern.PATHFINDING.getClosestNode(destination, Avern.pathfindingZone, targetGroup)
    
            const path = Avern.PATHFINDING.findPath(closestNode.centroid, destinationNode.centroid, Avern.pathfindingZone, 0);
    
            // if (path) {
            //   this.HELPER.setPlayerPosition(this.gameObject.transform.position)
            //   this.HELPER.setTargetPosition(destination)
            //   this.HELPER.setPath(path)
            // }
            this.path = path
        }

        let targetPosition = this.path[ 0 ];
        if (!this.path[0]) return
        this.velocity = targetPosition.clone().sub( this.gameObject.transform.position );
        this.updateRotationToFacePoint(this.gameObject.transform, targetPosition, this.lerpFactor)
      
        if (this.velocity.lengthSq() > 0.1) {
          this.velocity.normalize();
          // Move to next waypoint
          this.gameObject.transform.position.add( this.velocity.multiplyScalar( deltaTime * this.speed ) );
        } else {
          // Remove node from the path we calculated
          this.path.shift();
        }
        this.prevPlayerPosition.copy(destination)
    }
  }
  handleDeath() {
    this.behavior = "die_lol"
    this.onSignal("clear_target")
    this.emitSignal("clear_target", {visible: false, dead: true, id: this.gameObject.name})
    this.orderContainer.remove()
    Avern.State.Enemies = Avern.State.Enemies.filter(enem => enem.name !== this.gameObject.name)
    this.dead = true
    this.fadeIntoAction(this.death, 0.2)
  }

  onSignal(signalName, data={}) {
    switch(signalName){
      case "set_target":
        if (data.id !== this.gameObject.name && this.isTargeted) {
          // clear target
          this.orderContainer.classList.remove("targeted")
          this.isTargeted = false
          this.ring.visible = false
          gsap.set(this.bar, { opacity: 0})
        } else if (data.id === this.gameObject.name) {
          Avern.Sound.targetHandler.currentTime = 0
          Avern.Sound.targetHandler.play()
          this.isTargeted = true
          this.ring.visible = true
          gsap.set(this.bar, { opacity: 1})
          this.orderContainer.classList.add("targeted")
          this.emitSignal("active_target", { object: this.gameObject})
        }
        break;
      case "ordered_targets":
        if(data.targets.get(this.gameObject.name)){
          this.orderContainer.style.display = "flex"
          this.orderContainer.innerHTML = data.targets.get(this.gameObject.name).order
          this.orderContainer.style.transform = `translate(-50%, -150%) translate(${data.targets.get(this.gameObject.name).proximity}px, ${data.targets.get(this.gameObject.name).y}px )`;
        } else {
          this.orderContainer.style.display = "none"
          this.orderContainer.innerHTML = ""
        }
        break;
      case "closest_los":
        if (data.id === this.gameObject.name && !this.orderContainer.classList.contains("targeted")) this.orderContainer.classList.add("targeted")
        if (data.id !== this.gameObject.name && this.orderContainer.classList.contains("targeted")) this.orderContainer.classList.remove("targeted")
        break;
      case "entered_range":
        // this.ring.material.color.setHex( 0x56FBA1 );
        break;
      case "exited_range":
        // this.ring.material.color.setHex( 0xD20000 );
        break;  
      case "landmine_detonated":
        if (this.gameObject.transform.position.distanceTo(data.position) < data.radius) {
          if (this.behavior === "wander") {
            this.path = null
            this.behavior = "pursue"
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
            this.reactLarge.reset();
            this.reactLarge.fadeIn(0.2);
            this.reactLarge.play();
          }
        }
        break;
      case("receive_direct_attack"):
        if (this.isTargeted===true) {
          if (Avern.Player.transform.position.distanceTo(this.gameObject.transform.position) >= data.range) {
            this.emitSignal("show_notice", {notice: "Out of range", color: "red", delay: 2000})
            return
          }
          Avern.Sound.thudHandler.currentTime = 0.1
          Avern.Sound.thudHandler.play()   

          if (this.behavior === "wander") {
            this.path = null
            this.behavior = "pursue"
          }
          if (this.behavior=="idle") {
            this.path = null
            this.behavior = "pursue"

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
            this.reactLarge.reset();
            this.reactLarge.fadeIn(0.2);
            this.reactLarge.play();
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
        console.log("Clear target on self")
        this.isTargeted = false
        this.ring.visible = false
        this.orderContainer.classList.remove("targeted")
        gsap.set(this.bar, { opacity: 0})
        break;
      // case "line_of_sight":
      //   console.log(data.capsule.segment)
      //   const distance = distancePointToLine(this.gameObject.transform.position, data.capsule.segment, Avern.Player.transform)
      //   console.log(distance)
      //   this.emitSignal("los_distance", { distance })
      //   break;
    }
  }
  getScreenCoordinatesAndDistance() {
    const position = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    position.copy(this.gameObject.transform.position);
    position.y+=2
    position.project(Avern.State.camera);
  
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
  
    const x = (position.x * halfWidth) + halfWidth;
    const y = -(position.y * halfHeight) + halfHeight;

    const distanceToCamera = this.gameObject.transform.position.distanceTo(Avern.State.camera.getWorldPosition(cameraPosition));
    const frustum = new THREE.Frustum()
    const matrix = new THREE.Matrix4().multiplyMatrices(Avern.State.camera.projectionMatrix, Avern.State.camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    // enemy raycasts toward player
    // is its first collision with the player? if not there is something in the way
    const towardsEnemy = this.gameObject.transform.position.clone()
    towardsEnemy.y += 1
    towardsEnemy.sub(Avern.Player.transform.position.clone());
    const raycaster = new THREE.Raycaster(Avern.Player.transform.position, towardsEnemy.normalize());

    // Avern.State.scene.remove ( this.arrow );
    // this.arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, 0.5 * 0xffffff );
    // Avern.State.scene.add( this.arrow );

    const intersects = raycaster.intersectObjects([this.colliderCapsule.body, Avern.State.collider], false);
    const obstructed = intersects[0] && intersects[0].object.name !== "worldCollider"
    const visible = frustum.intersectsObject(this.colliderCapsule.body)

    return { x, y, distanceToCamera, visible, obstructed };
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
    this.addObserver(Avern.Interface.getComponent(Notices))
  }
}

export default Enemy