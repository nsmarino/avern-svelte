import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Body from '../Player/Body';


// import staging1 from '../../../../assets/staging-1.gltf'
// import staging2 from '../../../../assets/staging-2.gltf'


class Connection extends GameplayComponent {
    constructor(gameObject, spawnPoint) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)

        this.destination = spawnPoint.userData.label
        console.log("Destination of connection", this.destination)
        this.transitionStarted = false

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(gltf)
            this.gltf.scene.name = gameObject.name
            gameObject.transform.add(this.gltf.scene)

            this.colliderCapsule = generateCapsuleCollider(
                this.gltf.scene.getObjectByName("capsule-bottom"),
                this.gltf.scene.getObjectByName("capsule-top"),
                this.gltf.scene.getObjectByName("capsule-radius")
            )
            this.gameObject.transform.visible = false

            gameObject.transform.add(this.colliderCapsule.body)
        }
        initFromGLTF()
    }

    update() {
        if (Avern.Player && this.colliderCapsule) {
            const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
            if (collision.isColliding && !this.transitionStarted) {
                this.startTransition()
            }
        }
    }

    startTransition() {
        this.transitionStarted = true
        console.log("Start transition to", this.destination)
        // let url = ""
        // switch(this.destination){
        //     case "staging_1":
        //         console.log("load staging 1")
        //         url = staging1
        //         break;
        //     case "staging_2":
        //         console.log("load staging 2")
        //         url = staging2
        //         break;
        // }
		gsap.to(".mask", { opacity: 1, duration: 1})
		gsap.to(".mask svg", { opacity: 1, duration: 1})
		gsap.to(".mask p", { opacity: 1, duration: 1})
        setTimeout(async () => {
            await Avern.Loader.switchScene(this.destination)
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
        this.addObserver(Avern.Player.getComponent(Body))
    }
}

export default Connection
