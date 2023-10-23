import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {  } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"
import { 
    getScreenCoordinatesAndDistance, distancePointToLine
  } from '../../../helpers';
  
import Body from '../Player/Body';
import FollowCamera from '../Player/FollowCamera';
import Targeting from '../Player/Targeting';
import Actions from '../Player/Actions';
  
import GameplayComponent from '../../_Component';

class Targetable extends GameplayComponent {
    constructor(gameObject, canBeAttacked, targetRingRadius) {
        super(gameObject)

        this.gameObject = gameObject
        this.canBeAttacked = canBeAttacked || false
        console.log("Can be attacked?", this.canBeAttacked)
        this.isTargeted = false

        const torusGeometry = new THREE.TorusGeometry( targetRingRadius, 0.02, 12, 40 ); 
        const torusMaterial = new THREE.MeshBasicMaterial( { color: 0x56FBA1 } ); 
        this.ring = new THREE.Mesh( torusGeometry, torusMaterial );
        this.ring.rotation.x = Math.PI / 2
        this.ring.position.y+=1
        this.gameObject.transform.add( this.ring );
        this.ring.visible = false
  
        this.orderContainer = document.createElement("div")
        this.orderContainer.classList.add("order-container")
        document.body.appendChild(this.orderContainer)
    }

    update() {
        if (Avern.State.worldUpdateLocked == true) return
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
            case "has_collider":
                const { x, y, distanceToCamera, visible } = getScreenCoordinatesAndDistance(this.gameObject,data.collider, data.offsetY);
                const losDistance = Avern.Player.getComponent(Body).visionCapsule ? distancePointToLine(this.gameObject.transform.position, Avern.Player.getComponent(Body).visionCapsule.segment, Avern.Player.transform) : null
          
                if (!this.dead) this.emitSignal("target_visible", {
                  visible, 
                  id: this.gameObject.name, 
                  proximity: x,
                  y,
                  losDistance
                })
                if(this.isTargeted) this.emitSignal("targeted_object", { object: this.gameObject, x, y, distanceToCamera })
                break;
            case "set_target":
                if (data.id !== this.gameObject.name) {
                    this.isTargeted = false
                    this.ring.visible = false
                } else {
                    this.isTargeted = true
                    this.ring.visible = true

                    Avern.Sound.targetHandler.currentTime = 0
                    Avern.Sound.targetHandler.play()   
                    this.emitSignal("active_target", { object: this.gameObject, canBeAttacked: this.canBeAttacked})
       
                }
                this.emitSignal("set_target", { ...data, targeted: this.isTargeted })

            break;
            case "clear_target":
                this.isTargeted = false
                this.ring.visible = false
                this.emitSignal("clear_target")
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
            case "reset_stage":
                // console.log("reset", data)

            break;
        }
    }
    
    attachObservers(parent) {
        for (const component of parent.components) {
            if (!(component instanceof Targetable)) {
                this.addObserver(component)
            }
        }
        this.addObserver(Avern.Player.getComponent(Targeting))
        this.addObserver(Avern.Player.getComponent(Body))
        this.addObserver(Avern.Player.getComponent(FollowCamera))    
        this.addObserver(Avern.Player.getComponent(Actions))
    }
}

export default Targetable
