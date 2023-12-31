import GameplayComponent from '../../_Component';
import Enemy from "../NonPlayer/Enemy"
import Body from "./Body"
import Vitals from "./Vitals"
import ActionBar from "../../Interface/ActionBar"
import Notices from "../../Interface/Notices"
import ParticleFX from './ParticleFX';
import * as THREE from 'three';
import gsap from "gsap"
import {get} from 'svelte/store'

import { calculateDamageByDistance } from '../../../helpers';

class Actions extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)

        this.casting = false
        this.castingProgress = 0

        this.actionInProgress = false

        this.targeting = false
        this.targetDistance = null
        this.targetCanBeAttacked = false

        this.actionIndicator = null
        if (document.querySelector(".action-indicator")) {
            this.actionIndicator = document.querySelector(".action-indicator")
        } else {
            this.actionIndicator = document.createElement("div")
            this.actionIndicator.classList.add("action-indicator")
            gsap.set(this.actionIndicator, { opacity: 0 })
            document.body.appendChild(this.actionIndicator)
        }
    }

    handleInputs() {
        const inputs = Avern.Inputs.getInputs()
        
        if ( inputs.action1 ) {
            this.handleAction(get(Avern.Store.actions)[0],inputs)
        }
        if ( inputs.action2 ) {
            this.handleAction(get(Avern.Store.actions)[1],inputs)
        }
        if ( inputs.action3 ) {
            this.handleAction(get(Avern.Store.actions)[2],inputs)
        }
        if ( inputs.action4 ) {
            this.handleAction(get(Avern.Store.actions)[3],inputs)
        }
    }

    handleAction(action, inputs) {
        if (!action) return
        if (action.locked) {
            this.emitSignal("show_notice", {notice: "Action locked", color: "yellow", delay: 2000})
            return;
        }
        if (action.primed || action.isInstant) {
            console.log("action range", action, action.range)
            if (get(Avern.Store.player).energy < action.cost) {
                this.emitSignal("show_notice", {notice: "Not enough energy", color: "red", delay: 2000})
                return;
            } else if (!this.targeting) {
                this.emitSignal("show_notice", {notice: "Action requires a target", color: "red", delay: 2000})
                return;
            } else if (!this.targetCanBeAttacked) {
                this.emitSignal("show_notice", {notice: "You can't attack this target", color: "red", delay: 2000})
                return;            
            } else if (this.targetDistance && this.targetDistance > action.range) {
                this.emitSignal("show_notice", {notice: "Out of range", color: "red", delay: 2000})
                return;
            } else {
                if (!this.actionInProgress) this.doAction(action)
            }
        }
    }
    doAction(action) {
        this.actionInProgress = true

        Avern.Store.weapons.update(weapons=> {
            weapons.forEach(weapon => {
                weapon.actions.forEach(weaponAction=>{
                    weaponAction.primed = false
                    return weaponAction
                })
                return weapon
            })
            return weapons
        })
        this.emitSignal("spend_energy", {cost: action.cost})
        this.emitSignal("action_availed", { action })
    }
    
    handleActionResult(animation){
        gsap.to(this.actionIndicator, { opacity: 0, duration: 0.1 })
        const action = get(Avern.Store.actions).find(act => act.animation===animation)
        let flashPosition
        switch (action.id) {
            case "shoot_from_distance":
                // if (!Avern.State.target) return
                this.emitSignal("receive_direct_attack", {damage: action.baseDamage, range: action.range, generate: true })
                // eslint-disable-next-line no-case-declarations
                flashPosition = Avern.Player.getComponent(Body).rifleMesh.getWorldPosition(new THREE.Vector3())
                flashPosition.y += 1
                this.emitSignal("particle_fx", { position: flashPosition, duration: 20, color: "0xFFFFFF" })
                Avern.Sound.gunshotHandler.currentTime = 0.2
                Avern.Sound.gunshotHandler.play()        
                break;
            case "rapid_fire":
                // if (!Avern.State.target) return
                this.emitSignal("receive_direct_attack", {damage: action.baseDamage, range: action.range })
                // eslint-disable-next-line no-case-declarations
                flashPosition = Avern.Player.getComponent(Body).rifleMesh.getWorldPosition(new THREE.Vector3())
                flashPosition.y += 1
                this.emitSignal("particle_fx", { position: flashPosition, duration: 20 })
                Avern.Sound.gunshotHandler.currentTime = 0.05
                Avern.Sound.gunshotHandler.play()        
                break;
            case "bayonet_slash":
                    this.emitSignal("receive_direct_attack", {damage: action.baseDamage, range: action.range, generate: false })
                    // eslint-disable-next-line no-case-declarations
                    flashPosition = Avern.Player.getComponent(Body).rifleMesh.getWorldPosition(new THREE.Vector3())
                    flashPosition.y += 1
                    this.emitSignal("particle_fx", { position: flashPosition, duration: 20, color: "0xFF0000" })     
                break;
            case "rifle_club":
                    this.emitSignal("receive_direct_attack", {damage: action.baseDamage, range: action.range })
                    // eslint-disable-next-line no-case-declarations
                    flashPosition = Avern.Player.getComponent(Body).rifleMesh.getWorldPosition(new THREE.Vector3())
                    flashPosition.y += 1
                    this.emitSignal("particle_fx", { position: flashPosition, duration: 20 })     
                break;

            // case "blast_at_close_range":
            //     // if (!Avern.State.target) return
            //     this.emitSignal("receive_player_attack", {damage: 
            //         calculateDamageByDistance(
            //             action.baseDamage, 
            //             Avern.Player.transform.position.distanceTo(Avern.State.target.transform.position), 
            //             action.range, 
            //             2
            //         ) 
            //     })
            //     flashPosition = Avern.Player.getComponent(Body).rifleMesh.getWorldPosition(new THREE.Vector3())
            //     flashPosition.y += 1
            //     this.emitSignal("particle_fx", { position: flashPosition, duration: 80 })
            //     Avern.Sound.shotgunHandler.currentTime = 0
            //     Avern.Sound.shotgunHandler.play()
            //     break;
        }
    }

    startCast(action) {
        if (this.gameObject.getComponent(Body).movementLocked) return
        this.casting = true
        this.activeCast = action
        this.emitSignal("casting_start", {animation: action.primeAnimation, caption: action.caption})
        switch(action.id) {
            case "bayonet_slash":
                Avern.Sound.bayonetHandler.currentTime = 0
                Avern.Sound.bayonetHandler.play()
              break;
            case "shoot_from_distance":
                Avern.Sound.reloadHandler.currentTime = 0
                Avern.Sound.reloadHandler.play()
              break;
            case "blast_at_close_range":
                Avern.Sound.reloadHandler.currentTime = 0
                Avern.Sound.reloadHandler.play()
              break;
            case "set_land_mine":
                Avern.Sound.reloadHandler.currentTime = 0
                Avern.Sound.reloadHandler.play()
              break;
        }
    }

    interruptCast() {
        this.casting = false
        this.activeCast = null
        this.castingProgress = 0
        Avern.Sound.reloadHandler.pause()

        this.emitSignal("casting_interrupt")
    }

    reduceCast() {
        this.castingProgress = (this.castingProgress - 0.5 <= 0) ? 0 : this.castingProgress - 0.5
        this.emitSignal("casting_reduce", { 
            progress: this.castingProgress, 
            threshold: this.activeCast.primeLength 
        })
    }

    progressCast(delta) {
        this.castingProgress += delta
        this.emitSignal("casting_progress", { 
            progress: this.castingProgress, 
            threshold: this.activeCast.primeLength 
        })
    }

    finishCast(action) {
        this.casting = false
        this.castingProgress = 0
        this.activeCast = null

        Avern.Store.weapons.update(weapons=> {
            weapons.forEach(weapon => {
                weapon.actions.forEach(weaponAction=>{
                    weaponAction.primed = weaponAction.id === action.id ? true : false
                    return weaponAction
                })
                return weapon
            })
            return weapons
        })
        this.emitSignal("casting_finish", { action })

        // Need to set input keys on assignment via CharacterMenu
        this.actionIndicator.innerHTML = `<span>${get(Avern.Store.config).leftHanded ? action.inputKeyLeft : action.inputKeyRight}</span>`

        gsap.to(this.actionIndicator, { opacity: 1, duration: 0.1 })
        Avern.Sound.readyHandler.currentTime = 0
        Avern.Sound.readyHandler.play()
        if (action.id != "set_land_mine") this.emitSignal("clear_landmine")
        switch(action.id) {
            case "shoot_from_distance":
                Avern.Sound.reloadHandler.pause()
              break;
            case "blast_at_close_range":
                Avern.Sound.reloadHandler.pause()
              break;
            case "set_land_mine":
                Avern.Sound.reloadHandler.pause()
                this.emitSignal("set_landmine", {position: Avern.Player.transform.position})
              break;
          }
    }

    update = (delta) => {
        if (Avern.State.worldUpdateLocked || Avern.State.playerDead) return
        
        this.handleInputs()
        
        if (this.casting === true) {
            if (this.castingProgress < this.activeCast.primeLength) {
            this.progressCast(delta)
            } else {
                this.finishCast(this.activeCast)
            }
        }
        const { x, y, distanceToCamera } = this.getScreenCoordinatesAndDistance();
        
        const minDistance = 10; // Minimum distance for scaling
        const maxDistance = 100; // Maximum distance for scaling
        const scaleFactor = THREE.MathUtils.clamp(
        1 - (distanceToCamera - minDistance) / (maxDistance - minDistance),
        0.1, // Minimum scale factor
        1  // Maximum scale factor
        );
    
        const translateX = x;
        const translateY = y;
        this.actionIndicator.style.display="flex"
        this.actionIndicator.style.transform = `translate(200%, 900%) translate(${translateX}px, ${translateY}px) scale(${scaleFactor})`;
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
    
        return { x, y, distanceToCamera };
      }

    onSignal(signalName, data) {
        switch(signalName) {
          case "walk_start":
            this.interruptCast()
            break;
          case "action_crucial_frame":
            this.handleActionResult(data.id)
            break;
          case "finish_attack_anim":
            this.actionInProgress = false
            break;
          case "monster_attack":
            if (this.activeCast) this.reduceCast()
            break;
          case "player_death":
            if (this.activeCast) this.interruptCast()
            this.actionInProgress = false
            Avern.Store.weapons.update(weapons=> {
                weapons.forEach(weapon => {
                    weapon.actions.forEach(weaponAction=>{
                        weaponAction.primed = false
                        return weaponAction
                    })
                    return weapon
                })
                return weapons
            })
            break;
          case "active_target":
            this.targeting = true
            console.log("Recive data canBeAttacked", data)
            this.targetCanBeAttacked = data.canBeAttacked

            break;
          case "targeted_object":
            this.targetDistance = Avern.Player.transform.position.distanceTo(data.object.transform.position)
            break;
          case "clear_target":
            this.targeting = false
            break;
        }
    }
    attachObservers(parent) {
        this.addObserver(Avern.Interface?.getComponent(ActionBar))
        this.addObserver(Avern.Interface?.getComponent(Notices))
        this.addObserver(parent.getComponent(Body))
        this.addObserver(parent.getComponent(Vitals))
        this.addObserver(parent.getComponent(ParticleFX))
        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
    }
}

export default Actions