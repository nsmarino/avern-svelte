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

        this.dead = false
        this.gameObject = gameObject
        this.canBeAttacked = canBeAttacked || false
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
        this.orderContainer.innerHTML = `<svg viewBox="0 0 41 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2236 15.7385C20.2236 10.835 20.2236 5.92355 20.2236 1" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M1 19.5833H15.7385" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M19.584 22.7874V38.1666" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M22.7871 19.5833H39.448" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M19.583 11.8938C19.0102 11.8938 18.6769 12.1883 18.1487 12.3084C17.9568 12.352 17.7235 12.5531 17.5339 12.5645C17.2748 12.5801 17.0836 12.7898 16.8782 12.8161C16.4798 12.867 16.0312 13.4522 15.6852 13.6545C15.2142 13.9298 14.877 14.3196 14.4603 14.6606C14.1067 14.95 13.7666 15.4743 13.4995 15.8158C13.1291 16.2895 12.944 16.8584 12.944 17.4694C12.944 17.9759 12.9559 18.5739 12.7619 19.0205C12.5126 19.5943 12.7308 20.2617 12.5342 20.865" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12.5342 20.8647C12.5342 21.2521 12.8173 21.6322 12.8393 22.0328C12.859 22.3911 13.3258 22.7413 13.3733 23.1278C13.3899 23.2629 13.5469 23.4196 13.6361 23.5294C13.8256 23.7625 13.8684 24.0365 13.9836 24.3121C14.0387 24.4438 14.1546 24.9529 14.3269 24.9529C14.5156 24.9529 14.7251 24.9192 14.8821 25.0421C15.148 25.2503 15.4832 25.2865 15.7551 25.5207C16.0254 25.7534 16.4132 25.8565 16.7299 25.9912C17.0626 26.1327 17.5216 26.4661 17.8742 26.486C18.2255 26.5057 18.6024 26.5236 18.9422 26.632" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M18.9424 26.6321C19.5003 26.6321 20.0195 26.4047 20.545 26.4047C21.096 26.4047 21.7425 26.3111 22.2663 26.1731C22.6572 26.0701 23.1614 25.9053 23.5082 25.7226C23.9286 25.501 24.2698 25.1225 24.6542 24.8467C25.474 24.2587 25.9883 23.4397 26.4851 22.615C26.6787 22.2936 27.4307 19.5833 27.243 19.5833" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M27.1914 19.5834C27.1914 18.5084 27.2725 17.4753 27.2725 16.4087C27.2725 16.1826 27.1789 15.7288 26.9889 15.5812C26.8234 15.4526 26.5654 15.457 26.3812 15.2934C26.068 15.0153 25.7957 14.5318 25.589 14.1602C25.324 13.6835 24.8369 13.4655 24.3557 13.2519C23.8645 13.0338 23.3688 12.7041 22.8973 12.4424C21.9779 11.9321 21.2724 11.8938 20.2236 11.8938" stroke="#EC6F6F" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20.2236 4.84473C20.7583 4.84473 21.2931 4.84473 21.8278 4.84473C22.3667 4.84473 22.7962 5.22616 23.3173 5.22616C23.8006 5.22616 24.3551 5.64719 24.8451 5.75592C25.3913 5.87714 25.9804 6.05797 26.4874 6.31111C27.0801 6.60709 27.7124 6.79475 28.3207 7.11636C28.8784 7.41122 29.3684 7.95076 29.8102 8.39203C30.0065 8.588 30.3028 8.80328 30.4425 9.04046C30.6221 9.34538 30.7082 9.68593 30.8796 9.99404C31.1727 10.5209 31.1834 10.9658 31.7581 11.2528" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        <path d="M31.7588 11.2527C32.0416 11.4627 32.9986 11.9088 33.0889 12.2438C33.2558 12.8637 33.6161 13.4285 33.8503 14.0467C34.1821 14.9226 34.6067 15.8446 34.765 16.7591C34.8276 17.1206 34.9628 17.4623 34.9628 17.8236C34.9628 17.9455 34.9628 18.3193 34.9628 18.3009" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        <path d="M34.7957 18.3018C34.7957 19.2839 34.9038 20.2464 34.9591 21.2015C35.0258 22.3518 34.2075 23.4394 34.1419 24.5715C34.0833 25.5826 32.8933 26.2961 32.8343 27.3145C32.8116 27.7076 32.5319 28.0951 32.2214 28.3333C31.9061 28.5752 31.257 28.7961 31.1182 29.1954" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        <path d="M31.1173 29.1953C30.6615 29.1953 30.2414 29.7903 30.0438 30.1219C29.8209 30.496 29.7178 30.9449 29.2884 31.1803C28.875 31.407 28.5563 31.736 28.0603 31.8681C27.7344 31.9549 27.3116 32.1889 26.9825 32.3252C26.2553 32.6265 25.5838 33.0799 24.9548 33.536C24.5562 33.8251 24.0906 33.9929 23.6428 34.1785C23.1579 34.3794 22.3881 34.3103 21.8537 34.3103C21.3103 34.3103 20.767 34.3103 20.2236 34.3103" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        <path d="M20.2238 34.3218C19.7541 34.1014 19.0315 34.0874 18.5165 34.0874C18.088 34.0874 17.7356 33.9311 17.3232 33.9311C16.3225 33.9311 15.5507 33.8087 14.5967 33.4796C13.8481 33.2212 13.0249 32.6711 12.4452 32.1511C12.1497 31.886 11.6362 31.6413 11.2867 31.4478C10.9182 31.2437 10.7389 30.7698 10.3895 30.5708C10.1118 30.4126 9.89718 30.1486 9.60115 29.9847C9.21128 29.7688 9.02459 29.291 8.66475 29.086C8.43351 28.9543 8.30619 28.4625 8.02887 28.3045C7.58078 28.0493 7.5527 27.5355 7.32766 27.1367C6.97157 26.5057 6.49334 25.9421 6.15607 25.3003C5.87756 24.7703 5.88528 24.0833 5.60295 23.5767C5.48875 23.3718 5.56375 22.9835 5.56375 22.7562C5.56375 22.4816 5.48535 22.2188 5.48535 21.9356C5.48535 21.396 5.72054 19.794 5.72054 20.3337" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        <path d="M4.92384 19.5832C4.92384 18.9769 4.84473 18.3921 4.84473 17.7809C4.84473 17.2074 4.93374 16.7334 5.00735 16.1745C5.1435 15.1406 5.84707 14.2962 6.33034 13.4155C6.57869 12.9629 6.81804 12.3076 7.18303 11.9381C7.45165 11.6661 7.75164 11.2532 8.0489 11.0125C8.35087 10.7679 8.45406 10.3134 8.68622 10.0112C9.02075 9.57573 9.3956 9.12834 9.78944 8.7296C9.98486 8.53174 10.0609 8.28491 10.3389 8.20449C10.5134 8.15401 10.7604 7.99084 10.9366 7.90634C11.3825 7.69252 11.8445 7.57853 12.2816 7.34564C12.6637 7.142 13.1056 6.91685 13.5123 6.76714C13.9593 6.60255 14.2866 6.26151 14.7693 6.12188C15.1025 6.0255 15.4455 5.69054 15.7626 5.54783C16.0805 5.40478 16.6063 5.50463 16.8527 5.22743C17.1822 4.85678 17.507 4.84473 17.9779 4.84473C18.1757 4.84473 18.3735 4.84473 18.5712 4.84473C18.6556 4.84473 19.1443 4.84473 18.8481 4.84473" stroke="#EC6F6F" stroke-width="3" stroke-linecap="round"/>
        </svg>
        `
        document.body.appendChild(this.orderContainer)
    }

    update() {
        if (Avern.State.worldUpdateLocked == true) return
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
            case "has_collider":
                const { x, y, distanceToCamera, visible } = getScreenCoordinatesAndDistance(this.gameObject,data.collider, data.offsetY);
                const losDistance = Avern.Player.transform.position.distanceTo(this.gameObject.transform.position)
                // const losDistance = Avern.Player.getComponent(Body).visionCapsule ? distancePointToLine(this.gameObject.transform.position, Avern.Player.getComponent(Body).visionCapsule.segment, Avern.Player.transform) : null

                if (!this.dead) this.emitSignal("target_visible", {
                  visible, 
                  id: this.gameObject.name, 
                  proximity: x,
                  y,
                  losDistance,
                  distanceToCamera
                })
                if(this.isTargeted) this.emitSignal("targeted_object", { object: this.gameObject, x, y, distanceToCamera })
                break;
            case "set_target":
                if (data.id !== this.gameObject.name) {
                    this.isTargeted = false
                    this.ring.visible = false
                } else {
                    console.log(this.gameObject)

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
                this.emitSignal("clear_target", { ...data })
                if(data.dead) {
                    this.dead = true
                    this.orderContainer.remove()
                }
            break;
            case "ordered_targets":
                if(data.targets.get(this.gameObject.name)){
                    this.orderContainer.style.display = "flex"
                    // this.orderContainer.innerHTML = data.targets.get(this.gameObject.name).order
                    this.orderContainer.style.transform = `translate(-50%, -150%) translate(${data.targets.get(this.gameObject.name).proximity}px, ${data.targets.get(this.gameObject.name).y}px )`;
                } else {
                this.orderContainer.style.display = "none"
                // this.orderContainer.innerHTML = ""
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
