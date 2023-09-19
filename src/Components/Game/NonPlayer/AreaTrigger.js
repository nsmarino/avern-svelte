import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Body from '../Player/Body';

class AreaTrigger extends GameplayComponent {
    constructor(gameObject, spawnPoint) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)

        this.triggerId = spawnPoint.userData.label

        this.triggerSent = false

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(gltf)
            this.gltf.scene.name = gameObject.name
            gameObject.transform.add(this.gltf.scene)

            this.colliderCapsule = generateCapsuleCollider(
                this.gltf.scene.getObjectByName("capsule-bottom"),
                this.gltf.scene.getObjectByName("capsule-top"),
                this.gltf.scene.getObjectByName("capsule-radius")
            )
            // this.gameObject.transform.visible = false

            gameObject.transform.add(this.colliderCapsule.body)
        }
        initFromGLTF()
    }

    update() {
        if (Avern.Player && this.colliderCapsule) {
            const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
            if (collision.isColliding && !this.triggerSent) {
                this.sendTrigger()
            }
        }
    }

    sendTrigger() {
        this.triggerSent = true
        console.log("Start transition to", this.destination)
        this.emitSignal(this.triggerId, {})
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "example_signal":
            console.log("Example signal", data)
            break;
        }
    }
    
    attachObservers(parent) {
        this.addObserver(Avern.Player.getComponent(Body))
    }
}

export default AreaTrigger
