import * as THREE from 'three';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GameplayComponent from '../../_Component';
import Body from '../Player/Body';
import Targeting from '../Player/Targeting';
import {get} from "svelte/store"

class Interaction extends GameplayComponent {
    constructor(gameObject, spawnPoint, interactions) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)
        this.gameObject.transform.rotation.copy(spawnPoint.rotation)

        // Interaction content:
        this.interactions = interactions
        this.interactionsIndex = interactions.index
        // if in store.ongoing, update index
        const currentOngoingInteractions = get(Avern.Store.ongoingInteractions)
        if (currentOngoingInteractions[this.interactions.label] !== undefined) {
            this.interactionsIndex = currentOngoingInteractions[this.interactions.label]
        }

        this.prompt = this.interactions.content[this.interactionsIndex].prompt
        this.content = this.interactions.content[this.interactionsIndex].nodes
        this.contentIndex = 0

        // In world:
        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(this.interactions.model)
            this.gltf.scene.name = gameObject.name
            gameObject.transform.add(this.gltf.scene)
            this.gltf.scene.traverse(c => {
                c.castShadow = true
            })

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
            this.colliderCapsule.ring.visible=true
            gameObject.transform.add(this.colliderCapsule.ring)
            this.colliderCapsule.body.onPlayerLook = this.onPlayerLook.bind(this)
            this.colliderCapsule.body.onPlayerAction = this.onPlayerAction.bind(this)


            // Anims
            this.mixer = new THREE.AnimationMixer( this.gltf.scene );

            const clips = this.gltf.animations

            this.idle = this.mixer.clipAction(
                THREE.AnimationClip.findByName(clips, interactions.anim)
            )

            this.action = this.idle
            if (this.action) this.fadeIntoAction(this.action,0)

        }
        initFromGLTF()
    }
    fadeIntoAction(newAction=this.idle, duration=0.2) {
        if (this.current_action) {
            this.current_action.fadeOut(duration);
        }
        this.action = newAction
        this.action.reset();
        this.action.fadeIn(duration);
        this.action.play();
        this.current_action = this.action;
    }

    update(delta) {
        if (this.mixer && Avern.State.worldUpdateLocked == false) this.mixer.update(delta);
        if (this.colliderCapsule) {
            this.capsuleBottom.getWorldPosition(this.startWorldPos)
            this.capsuleTop.getWorldPosition(this.endWorldPos)
      
            this.colliderCapsule.segment.start.copy(this.startWorldPos)
            this.colliderCapsule.segment.end.copy(this.endWorldPos)
            
            if (Avern.Player) {
              const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
              if (collision.isColliding) {
                this.emitSignal("capsule_collide", {collision, capsule: this.colliderCapsule})
                this.emitSignal("has_collider", {collider: this.colliderCapsule, offsetY: 2})
              }
            }

          }
    }

    onPlayerLook() {
        Avern.Store.prompt.set(this.prompt)
    }

    onPlayerAction() {
        Avern.Sound.pageHandler.currentTime = 0
        Avern.Sound.pageHandler.play()

        if (this.content[this.contentIndex]) {
            if (this.contentIndex === 0) {
                Avern.Store.prompt.set("")
                Avern.State.worldUpdateLocked = true
            }
            Avern.Store.interaction.set({active: true, node: this.content[this.contentIndex]})
            if (this.content[this.contentIndex].trigger) {
                console.log("TRIGGER! Update worldEvents in store, emit signal?")
            }
            if (this.content[this.contentIndex].item) {
                console.log("ITEM !!!! Update inventory in store, emit signal?")
            }
            if (this.content[this.contentIndex].weapon) {
                Avern.Sound.itemHandler.currentTime=0
                Avern.Sound.itemHandler.play()
                const weaponContent = Avern.Content.weapons.find(i => i.label === this.content[this.contentIndex].weapon)
                this.emitSignal("get_weapon", {weapon: weaponContent})
                Avern.Store.weapons.update((weapons)=>{
                    weapons.push(weaponContent)
                    return weapons
                })
            }

            this.contentIndex += 1
        } else {
            this.clearInteraction()
        }
    }

    clearInteraction() {
        Avern.State.worldUpdateLocked = false
        this.emitSignal("clear_target", { visible: false})
        Avern.Store.interaction.set({active: false, node: {}})
        this.contentIndex = 0
        if (this.interactions.content[this.interactionsIndex+1]) {
            this.content= this.interactions.content[this.interactionsIndex+1].nodes
            this.prompt= this.interactions.content[this.interactionsIndex+1].prompt
            Avern.Store.ongoingInteractions.update(ong => {
                ong[this.interactions.label] = this.interactionsIndex+1
                return ong
            })
            this.interactionsIndex+=1
            if (!get(Avern.Store.endOfDemoShown) && this.interactions.label==="esthel-captive") {
                setTimeout(() => {
                  Avern.Store.endOfDemoVisible.set(true)
                  Avern.Store.endOfDemoShown.set(true)
                }, 1000)
              }
        }

        Avern.Store.prompt.set(this.prompt)
    }


    attachObservers(parent) {
        for (const component of parent.components) {
            if (!(component instanceof Interaction)) {
              this.addObserver(component)
            }
          }
        this.addObserver(Avern.Player?.getComponent(Body))
        this.addObserver(Avern.Player?.getComponent(Targeting))
    
    }
}

export default Interaction