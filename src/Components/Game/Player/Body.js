import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import playerGltf from "../../../../assets/pc/fse--PC-DEMO.gltf"
import GameplayComponent from '../../_Component';
import Actions from "./Actions"
import InteractionOverlay from '../../Interface/InteractionOverlay';
import Enemy from '../NonPlayer/Enemy';
import Vitals from './Vitals';
import Inventory from './Inventory';
import gsap from "gsap"
import {generateCapsuleCollider} from "../../../helpers"

const RESET = "RESET"
const REPLACE = "REPLACE"

class Body extends GameplayComponent {
    constructor(gameObject, to) {
        super(gameObject)
        this.gameObject = gameObject
        this.gltf = null
        this.run = null
        this.idle = null
        this.radius = 0.8
        this.velocity = new THREE.Vector3();
        this.transform = gameObject.transform

        this.targeting = false

        this.action = {
            id: null,
            anim: null,
            crucialFrame: null,
        }

        this.movementLocked = false
        this.crucialFrameSent = false

        if (to) {
            console.log("SUCCESSFULLY PASSED", to, "TO PLAYER BODY")
            const spawnFrom = Avern.GameObjects.getGameObjectByName(to)
            console.log(spawnFrom)
            this.transform.position.copy(spawnFrom.transform.position)
            console.log("I will copy this rotation:", spawnFrom.transform.rotation.y)
            this.gameObject.transform.rotation.copy(spawnFrom.transform.rotation)

        } else {
            this.transform.position.set( 0, 3, 0 )
        }

        this.transform.capsuleInfo = {
            radius: this.radius,
            segment: new THREE.Line3( new THREE.Vector3(), new THREE.Vector3( 0, -1.0, 0.0 ))
        };

        this.originVector = new THREE.Vector3()
        this.originVector.copy(this.gameObject.transform.position)
        this.groundRaycast = new THREE.Raycaster(this.originVector, new THREE.Vector3(0, -1, 0))
        this.groundRaycast.firstHitOnly = true
        this.distanceToGround = 0
        this.isOnGround = false
        this.tempVector = new THREE.Vector3();
        this.tempVector2 = new THREE.Vector3();
        this.tempBox = new THREE.Box3();
        this.tempMat = new THREE.Matrix4();

        this.tempSegment = new THREE.Line3();
        this.capsuleCollisionDelta = new THREE.Vector3()

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(playerGltf)
            this.gltf.scene.name = gameObject.name

            this.transform.add(this.gltf.scene)
            this.gltf.scene.traverse(child => {
                child.castShadow = true;
                child.receiveShadow = true;
                child.frustumCulled = false;
                // weird hardcoding for mixamo model :(
                child.translateY(-0.9)
                child.translateZ(.9)
            })

            // Add rifle to hand
            const handBone = this.gltf.scene.getObjectByName("mixamorigRightHand")
            this.rifleMesh = this.gltf.scene.getObjectByName("RIFLE_IN_HAND")
            this.rifleMesh.scale.set(0.3,0.3,0.3);
            handBone.add(this.rifleMesh)
            this.rifleMesh.visible  = false

            const spineBone = this.gltf.scene.getObjectByName("mixamorigSpine2")
            this.rifleOnBackMesh = this.gltf.scene.getObjectByName("RIFLE_ON_BACK")
            this.rifleOnBackMesh.scale.set(0.3,0.3,0.3);
            this.rifleOnBackMesh.position.z -= 10
            this.rifleOnBackMesh.position.y += 20
            this.rifleOnBackMesh.position.x += 20
            spineBone.add(this.rifleOnBackMesh)

            this.transform.add(this.gltf.scene)

            this.mixer = new THREE.AnimationMixer( this.gltf.scene );

            const clips = this.gltf.animations
            // Player actions
            this.idle = {
                id: "idle",
                anim: this.setUpAnim(clips, "IDLE", true, false),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.run = {
                id: "forward",
                anim: this.setUpAnim(clips, "FORWARD", true, false),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.runBack = {
                id: "back",
                anim: this.setUpAnim(clips, "BACK", true, false),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.runTurn = {
                id: "run_turn",
                anim: this.setUpAnim(clips, "RUNNING_TURN", false, true),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.idleTurn = {
                id: "idle_turn",
                anim: this.setUpAnim(clips, "IDLE_TURN", false, true),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.strafeLeft = {
                id: "strafe_left",
                anim: this.setUpAnim(clips, "STRAFE_L", true, false),
                crucialFrame: null,
                canInterrupt: false,
            },
            this.strafeRight = {
                id: "strafe_right",
                anim: this.setUpAnim(clips, "STRAFE_R", true, false),
                crucialFrame: null,
                canInterrupt: false,
            },
            this.death = {
                id: "death",
                anim: this.setUpAnim(clips, "DEATH", false, true),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.load = {
                id: "load",
                anim: this.setUpAnim(clips, "LOAD", false, false, 1.1),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.withdraw = {
                id: "withdraw",
                anim: this.setUpAnim(clips, "WITHDRAW_BLADE", false, false, 1.1),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.loadShotgun = {
                id: "load_shotgun",
                anim: this.setUpAnim(clips, "LOAD", false, false, 2.6),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.react = {
                id: "react",
                anim: this.setUpAnim(clips, "REACT_SMALL", false, false),
                crucialFrame: null,
                canInterrupt: false,
            }
            this.shoot = {
                id: "shoot",
                anim: this.setUpAnim(clips, "KNEEL_AND_FIRE_RIFLE", false, true, 3.5),
                crucialFrame: 50,
                canInterrupt: true,
            }
            this.fire = {
                id: "fire",
                anim: this.setUpAnim(clips, "KNEEL_AND_FIRE_RIFLE", false, true, 3),
                crucialFrame: 50,
                canInterrupt: true,
            }
            this.club = {
                id: "club",
                anim: this.setUpAnim(clips, "RIFLE_PUNCH", false, true),
                crucialFrame: 50,
                canInterrupt: true,
            }
            this.slash = {
                id: "slash",
                anim: this.setUpAnim(clips, "SLASH", false, true, 1),
                crucialFrame: 30,
                canInterrupt: true,
            }
            this.shotgun = {
                id: "shotgun",
                anim: this.setUpAnim(clips, "SHOTGUN", false, true, 2.5),
                crucialFrame: 45,
                canInterrupt: true,
            }
            this.drink = {
                id: "drink",
                anim: this.setUpAnim(clips, "DRINK", false, true, 1.5),
                crucialFrame: null,
                canInterrupt: true,
            }

            // ceremonial dagger:
            this.pommel_smack = {
                id: "pommel_smack",
                anim: this.setUpAnim(clips, "POMMEL_SMACK", false, true, 1),
                crucialFrame: 30,
                canInterrupt: true,
            }
            this.thrust_slash = {
                id: "thrust_slash",
                anim: this.setUpAnim(clips, "THRUST_SLASH", false, true, 1),
                crucialFrame: 30,
                canInterrupt: true,
            }
            this.open_artery = {
                id: "open_artery",
                anim: this.setUpAnim(clips, "OPEN_ARTERY", false, true, 1),
                crucialFrame: 30,
                canInterrupt: true,
            }
            this.lose_yourself = {
                id: "lose_yourself",
                anim: this.setUpAnim(clips, "BATTLE_CRY", false, true, 1),
                crucialFrame: 30,
                canInterrupt: true,
            }

            this.action = this.idle
            this.fadeIntoAction(this.action, 0, false)

            this.mixer.addEventListener('finished', this.onMixerFinish.bind(this))

            this.visionStart = this.gltf.scene.getObjectByName("vision-start")
            this.visionEnd = this.gltf.scene.getObjectByName("vision-end")
            this.visionRadius = this.gltf.scene.getObjectByName("vision-radius")
            this.visionCapsule = generateCapsuleCollider(
              this.visionStart,
              this.visionEnd,
              this.visionRadius
            )
        }
        initFromGLTF()
    }

    setUpAnim(fileClips, clipName, loop, clamp, duration) {
        const anim = this.mixer.clipAction(THREE.AnimationClip.findByName(fileClips, clipName))
        if (clamp) anim.clampWhenFinished = true
        if (duration) anim.setDuration(duration)
        if (!loop) anim.setLoop(THREE.LoopOnce)
        return anim
    }

    onMixerFinish(e) {
        const inputs = Avern.Inputs.getInputs()

        /* eslint-disable no-fallthrough */
        switch(e.action) {
            case this.idleTurn.anim:
            case this.runTurn.anim:
                if (inputs.forward) {
                    this.fadeIntoAction(this.run, 0.001, REPLACE)
                } else if (inputs.back) {
                    this.fadeIntoAction(this.run, 0.001, REPLACE)
                    this.backIsForwards = true
                } else {
                    this.fadeIntoAction(this.idle, 0.001, REPLACE)
                    Avern.Sound.fxHandler.pause()
                }
                this.gameObject.transform.rotateY(Math.PI)
                break;
            case this.drink.anim:
                this.emitSignal("player_heal")
            case this.shoot.anim:
            case this.fire.anim:
            case this.thrust_slash.anim:
            case this.pommel_smack.anim:
            case this.lose_yourself.anim:
            case this.open_artery.anim:
            case this.slash.anim:
            case this.club.anim:
                if (inputs.forward) {
                    this.fadeIntoAction(this.run, 0.1, REPLACE)
                } else if (inputs.back) {
                    this.fadeIntoAction(this.runBack, 0.1, REPLACE)
                } else {
                    this.fadeIntoAction(this.idle, 0.1, REPLACE)
                }
                if (inputs.forward || inputs.back || (inputs.left && this.targeting) || (inputs.right && this.targeting) ) Avern.Sound.fxHandler.play()
                this.movementLocked = false
                this.crucialFrameSent = false;        
                break;
        }
        /* eslint-enable no-fallthrough */
    }

    fadeIntoAction(newAction, duration, handleCurrent="CONTINUE") {
        if (handleCurrent===REPLACE) {
            this.action.anim.fadeOut(duration);
            this.action = newAction
        } else if (handleCurrent===RESET && !this.crucialFrameSent) {
            this.action.anim.reset()
            this.action.anim.play()
        }
        newAction.anim.reset();
        newAction.anim.fadeIn(duration);
        newAction.anim.play();
    }

    update(delta) {
        if (this.action.anim != null && this.action.crucialFrame != null) {
            const currentFrame = Math.floor(this.action.anim.time * 30);
            if (currentFrame >= this.action.crucialFrame && !this.crucialFrameSent) {
              this.crucialFrameSent = true;
              this.emitSignal("action_crucial_frame", {id: this.action.id})
            }
        }

        const inputs = Avern.Inputs.getInputs()
        if (!Avern.State.playerDead && !this.movementLocked) {
            if (inputs.flask) {
                this.movementLocked = true
                Avern.Sound.drinkHandler.currentTime = 0
                Avern.Sound.drinkHandler.play()
                this.fadeIntoAction(this.drink,0.2, REPLACE)
            }
            if (inputs.turnWasPressed) {
                if (inputs.forward || inputs.back) {
                    this.fadeIntoAction(this.runTurn, 0.1, REPLACE)
                } else {
                    this.fadeIntoAction(this.idleTurn, 0.1, REPLACE)
                }
                // do this on crucial frame, not on animation complete
                // this.gameObject.transform.rotateY(Math.PI)
            }
            if ( inputs.forwardWasPressed) {
                if (this.rifleMesh && this.rifleOnBackMesh) {
                    this.rifleOnBackMesh.visible = true
                    this.rifleMesh.visible = false
                }
                this.fadeIntoAction(this.run, 0.2, REPLACE)
                Avern.Sound.fxHandler.currentTime = 0
                Avern.Sound.fxHandler.play()
                this.emitSignal("walk_start")
            }
            if ( inputs.backWasPressed) {
                Avern.Sound.fxHandler.currentTime = 0
                Avern.Sound.fxHandler.play()
                this.emitSignal("walk_start")
                this.fadeIntoAction(this.runBack, 0.2, REPLACE)
            }

            if ( inputs.leftWasPressed && this.targeting ) {
                Avern.Sound.fxHandler.currentTime = 0
                Avern.Sound.fxHandler.play()
                this.emitSignal("walk_start")
                this.fadeIntoAction(this.strafeLeft, 0.2, REPLACE)
            }
            if ( inputs.rightWasPressed && this.targeting ) {
                Avern.Sound.fxHandler.currentTime = 0
                Avern.Sound.fxHandler.play()
                this.emitSignal("walk_start")
                this.fadeIntoAction(this.strafeRight, 0.2, REPLACE)
            }

            if (inputs.backWasLifted && this.backIsForwards) this.backIsForwards = false

            if ( inputs.forwardWasLifted || inputs.backWasLifted || inputs.leftWasLifted || inputs.rightWasLifted ) {
                if (this.action == this.runTurn || this.action == this.idleTurn) return
                if (inputs.forward || (inputs.back && this.backIsForwards)){
                    if (this.action.id == this.run.id) return
                    this.fadeIntoAction(this.run, 0.1, REPLACE)
                } else if (inputs.back && !this.backIsForwards) {
                    if (this.action.id == this.runBack.id) return
                    this.fadeIntoAction(this.runBack, 0.1, REPLACE)
                } else if (inputs.left && this.targeting) {
                    this.fadeIntoAction(this.strafeLeft, 0.1, REPLACE)
                } else if (inputs.right && this.targeting) {
                    this.fadeIntoAction(this.strafeRight, 0.1, REPLACE)
                } else {
                    if (this.action != this.idle) this.fadeIntoAction(this.idle, 0.1, REPLACE)
                    Avern.Sound.fxHandler.pause()
                }
            }        
        }
        if (this.mixer && Avern.State.worldUpdateLocked == false) this.mixer.update(delta);
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
            case "casting_start":
                this.rifleMesh.visible = true
                this.rifleOnBackMesh.visible = false
                this.fadeIntoAction(this[data.animation], 0.1, REPLACE)
                break;
            case "casting_finish":
                this.fadeIntoAction(this.idle, 0.1, REPLACE)
                break;
            case "casting_reduce":
                this.mixer.setTime(data.progress)
                break;
            case "action_availed":
                this.movementLocked = true
                Avern.Sound.fxHandler.pause()

                this.fadeIntoAction(this[data.action.animation],0.1, REPLACE)
                if (this.rifleMesh && this.rifleOnBackMesh && data.action.id !== "set_land_mine") {
                    this.rifleMesh.visible = true
                    this.rifleOnBackMesh.visible = false
                }

                break;

            case "player_receive_heavy_damage":
                if (this.action.canInterrupt) {
                    this.fadeIntoAction(this.react, 0.2, RESET)
                } else {
                    this.fadeIntoAction(this.react)
                }

                break;
            case "player_death":
                this.fadeIntoAction(this.death, 0, REPLACE)
                gsap.to(".mask", { opacity: 1, duration: 4, delay: 2})
                gsap.to(".mask svg", { opacity: 1, duration: 0.2, delay: 3})
                gsap.to(".mask p", { opacity: 1, duration: 0.2, delay: 3})
        
                setTimeout(()=> {
                    // Handle resets internal to this component
    
                    this.gameObject.transform.position.set( 0, 3, 0 );
                    this.fadeIntoAction(this.idle, 0.1, REPLACE)

                    this.movementLocked = false
                    this.crucialFrameSent = false

                    gsap.to(".mask", { opacity: 1, duration: 1})
                    gsap.to(".mask svg", { opacity: 1, duration: 1})
                    gsap.to(".mask p", { opacity: 1, duration: 1})
                    setTimeout(async () => {
                        Avern.State.playerDead = false
                        Avern.Store.player.update(player => {
                            const updatedPlayer = {
                              ...player,
                              hp: player.maxHp
                            }
                            return updatedPlayer
                          })
                        await Avern.Loader.switchScene("player-restart")
                    }, 1000)
                },6000)
                break;
            case "capsule_collide":
                this.onCapsuleCollide(data)
                break;
            case "active_target":
                console.log("Received active target")
                this.targeting = true
                break;
            case "clear_target":
                console.log("Received clear target")
                this.targeting = false
                break;
            case "targeted_object":
                // lazy fix for bug in auto-target on death of current target
                if (!this.targeting) this.targeting=true
                const lookVector = new THREE.Vector3(data.object.transform.position.x, this.transform.position.y, data.object.transform.position.z)
                this.transform.lookAt(lookVector)
                break;
            case "world_collide":
                if (!Avern.State.playerDead) this.onWorldCollide(data)
                break;
        }
    }
    
    onCapsuleCollide(data) {
        this.capsuleCollisionDelta.subVectors( data.collision.closestPoint1, data.collision.closestPoint2 );
        const depth = this.capsuleCollisionDelta.length() - ( this.radius + data.capsule.radius );
        if ( depth < 0 ) {
            this.capsuleCollisionDelta.normalize();

        // get the magnitude of the velocity in the hit direction
        const v1dot = this.deltaVector.dot( this.capsuleCollisionDelta );
        const v2dot = data.capsule.velocity.dot( this.capsuleCollisionDelta );
    
        const offsetRatio1 = Math.max( v1dot, 0.2 );
        const offsetRatio2 = Math.max( v2dot, 0.2 );

        const total = offsetRatio1 + offsetRatio2;
        const ratio = offsetRatio1 / total;
        this.capsuleCollisionDelta.y = 0
        this.transform.position.addScaledVector( this.capsuleCollisionDelta, - ratio * depth );
        }
    }

    onWorldCollide(data) {
        const { collider, delta } = data
        const inputs = Avern.Inputs.getInputs()
        const transform = this.transform

        transform.updateMatrixWorld();

        // adjust player position based on collisions
        const capsuleInfo = transform.capsuleInfo;

        this.tempBox.makeEmpty();
        this.tempMat.copy( collider.matrixWorld ).invert();
        this.tempSegment.copy( capsuleInfo.segment );

        // get the position of the capsule in the local space of the collider
        this.tempSegment.start.applyMatrix4( transform.matrixWorld ).applyMatrix4( this.tempMat );
        this.tempSegment.end.applyMatrix4( transform.matrixWorld ).applyMatrix4( this.tempMat );

        // get the axis aligned bounding box of the capsule
        this.tempBox.expandByPoint( this.tempSegment.start );
        this.tempBox.expandByPoint( this.tempSegment.end );

        this.tempBox.min.addScalar( - capsuleInfo.radius );
        this.tempBox.max.addScalar( capsuleInfo.radius );

        collider.geometry.boundsTree.shapecast( {
            intersectsBounds: box => box.intersectsBox( this.tempBox ),
            intersectsTriangle: tri => {
                // check if the triangle is intersecting the capsule and adjust the
                // capsule position if it is.
                const triPoint = this.tempVector;
                const capsulePoint = this.tempVector2;
    
                const distance = tri.closestPointToSegment( this.tempSegment, triPoint, capsulePoint );
                if ( distance < capsuleInfo.radius ) {
                    const depth = capsuleInfo.radius - distance;
                    const direction = capsulePoint.sub( triPoint ).normalize();
                    this.tempSegment.start.addScaledVector( direction, depth );
                    this.tempSegment.end.addScaledVector( direction, depth );
                }
            }
        });
    
        // get the adjusted position of the capsule collider in world space after checking
        // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
        // the origin of the player model.
        const newPosition = this.tempVector;
        newPosition.copy( this.tempSegment.start ).applyMatrix4( collider.matrixWorld );
        // check how much the collider was moved
        const deltaVector = this.tempVector2;
        deltaVector.subVectors( newPosition, transform.position );

        // Did you fall through the hole in the ground?
        if ( transform.position.y < - 100 ) {
            this.velocity.set( 0, 0, 0 );
            transform.position.set( 0, 3, 0 );
        }

        this.gameObject.transform.getWorldPosition(this.originVector)
        const groundIntersect = this.groundRaycast.intersectObject(collider)
        this.distanceToGround = groundIntersect[0] ? groundIntersect[0].distance : null

        // Add movement from user input to vector from collision data
        const inputVector = new THREE.Vector3()
        const strafeVector = new THREE.Vector3()

        if ( (inputs.forward && !this.movementLocked) || inputs.back && !this.movementLocked && this.backIsForwards) {
            const forwardSpeed = this.targeting ? 6 : 12
            transform.getWorldDirection(inputVector).multiplyScalar(delta).multiplyScalar(forwardSpeed)
            deltaVector.add(inputVector)
        } else if ( inputs.back && !this.movementLocked ) {
            transform.getWorldDirection(inputVector).multiplyScalar(delta).multiplyScalar(-6)
            deltaVector.add(inputVector)
        }
        if ( inputs.left ) {
            if (this.targeting && !this.movementLocked) {
                const perpendicularVector = new THREE.Vector3();
                perpendicularVector.crossVectors(transform.getWorldDirection(strafeVector), new THREE.Vector3(0, 1, 0));
                perpendicularVector.normalize().multiplyScalar(delta).multiplyScalar(-4);
                deltaVector.add(perpendicularVector);
            } else if (!this.targeting) {
                transform.rotateY(0.007)
            }
        }
            
        if ( inputs.right ) {
            if (this.targeting && !this.movementLocked) {
                const perpendicularVector = new THREE.Vector3();
                perpendicularVector.crossVectors(transform.getWorldDirection(strafeVector), new THREE.Vector3(0, 1, 0));
                perpendicularVector.normalize().multiplyScalar(delta).multiplyScalar(4);
                deltaVector.add(perpendicularVector);
            } else if (!this.targeting) {
                transform.rotateY(-0.007)
            }
        }

        if ( inputs.jump ) {
            if (this.distanceToGround < 2.1 && this.distanceToGround !== null) {
                this.velocity.y = Avern.Config.player.jumpHeight
            }
        }

        // if the player was primarily adjusted vertically we assume it's on something we should consider ground
        this.isOnGround = deltaVector.y > Math.abs( delta * this.velocity.y * 0.25 );
        const offset = Math.max( 0.0, deltaVector.length() - 1e-5 );
        deltaVector.normalize().multiplyScalar( offset );

        if ( this.isOnGround && !inputs.jump) {
            this.velocity.y = delta * Avern.Config.world.gravity;
        } else {
            this.velocity.y += delta * Avern.Config.world.gravity;
        }
        transform.position.addScaledVector( this.velocity, delta );
        transform.position.add( deltaVector );
        this.deltaVector = deltaVector
    }

    attachObservers(parent) {
        this.addObserver(parent.getComponent(Actions))
        this.addObserver(Avern.Interface.getComponent(InteractionOverlay))
        this.addObserver(parent.getComponent(Vitals))
        this.addObserver(parent.getComponent(Inventory))
        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
    }
}

export default Body