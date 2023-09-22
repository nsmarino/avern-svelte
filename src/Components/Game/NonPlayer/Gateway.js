import * as THREE from 'three';
import gsap from "gsap"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'

import GameplayComponent from '../../_Component';
import Notices from '../../Interface/Notices';
import Body from '../Player/Body';

class Gateway extends GameplayComponent {
    constructor(gameObject, spawnPoint, content) {
        super(gameObject)
        this.gameObject = gameObject
        this.content = content
        this.prompt = content.prompt
        this.gameObject.transform.position.copy(spawnPoint.position)

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(gltf)
            this.gltf.scene.name = gameObject.name
            gameObject.transform.add(this.gltf.scene)

            this.colliderCapsule = generateCapsuleCollider(
                this.gltf.scene.getObjectByName("capsule-bottom"),
                this.gltf.scene.getObjectByName("capsule-top"),
                this.gltf.scene.getObjectByName("capsule-radius")
            )
            gameObject.transform.add(this.colliderCapsule.body)
            this.colliderCapsule.body.onPlayerLook = this.onPlayerLook.bind(this)
            this.colliderCapsule.body.onPlayerAction = this.onPlayerAction.bind(this)
            this.colliderIsActive=true
        }
        initFromGLTF()
    }

    update() {

        if (Avern.Player && this.colliderCapsule && this.colliderIsActive) {
            const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
            if (collision.isColliding) {
              this.emitSignal("capsule_collide", {collision, capsule: this.colliderCapsule})
            }
        }
    }

    onPlayerLook() {
        if (this.colliderIsActive) Avern.Store.prompt.set(this.prompt)
    }

    onPlayerAction() {
        const key = get(Avern.Store.items).find(i=>i.id===this.content.unlockedBy)
        if (key) {
            this.colliderIsActive = false
            this.gameObject.transform.visible = false
            Avern.Store.worldEvents.update(events => {
                const updatedEvents = {
                    ...events,
                    gateUnlocked: true

                }
                return updatedEvents
            })
            this.emitSignal("show_notice", { notice: `Unlocked with ${key.name}`, color: "yellow", delay: 5000})
        } else {
            this.emitSignal("show_notice", { notice: `Locked`, color: "red", delay: 5000})
        }
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
        this.addObserver(Avern.Interface.getComponent(Notices))
    }
}

export default Gateway
