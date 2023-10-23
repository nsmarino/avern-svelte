import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/obelisk.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Body from '../Player/Body';

class Connection extends GameplayComponent {
    constructor(gameObject, spawnPoint) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)

        this.destination = spawnPoint.userData.label
        this.transitionStarted = false

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(gltf)
            this.gltf.scene.name = gameObject.name
            this.gltf.scene.traverse(child => {
                child.castShadow = true;
                child.frustumCulled = false;
            })
            gameObject.transform.add(this.gltf.scene)


            this.colliderCapsule = generateCapsuleCollider(
                this.gltf.scene.getObjectByName("capsule-bottom"),
                this.gltf.scene.getObjectByName("capsule-top"),
                this.gltf.scene.getObjectByName("capsule-radius")
            )
            gameObject.transform.add(this.colliderCapsule.body)
            this.colliderCapsule.ring.visible=true
            gameObject.transform.add(this.colliderCapsule.ring)
            this.colliderCapsule.body.onPlayerLook = this.onPlayerLook.bind(this)
            this.colliderCapsule.body.onPlayerAction = this.startTransition.bind(this)

        }
        initFromGLTF()
    }

    update() {
        if (Avern.Player && this.colliderCapsule) {
            const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
            if (collision.isColliding) {
                this.emitSignal("capsule_collide", {collision, capsule: this.colliderCapsule})
            }
            this.emitSignal("has_collider", {collider: this.colliderCapsule, offsetY: 2})
        }
    }

    onPlayerLook() {
        Avern.Store.prompt.set("Travel")
    }

    startTransition() {
        if (this.transitionStarted) return
        this.transitionStarted = true
		gsap.to(".mask", { opacity: 1, duration: 1})
		gsap.to(".mask svg", { opacity: 1, duration: 1})
		gsap.to(".mask p", { opacity: 1, duration: 1})
        setTimeout(async () => {
            await Avern.Loader.switchScene(this.destination)
            Avern.Store.prompt.set(null)

        }, 1000)
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "example_signal":
            console.log("Example signal", data)
            break;
        }
    }
    
    attachObservers(parent) {
        for (const component of parent.components) {
            if (!(component instanceof Connection)) {
              this.addObserver(component)
            }
        }
        this.addObserver(Avern.Player.getComponent(Body))
    }
}

export default Connection
