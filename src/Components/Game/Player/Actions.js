import GameplayComponent from '../../_Component';
import Enemy from "../NonPlayer/Enemy"
import Body from "./Body"
import ActionBar from "../../Interface/ActionBar"
import Notices from "../../Interface/Notices"
import Landmine from './Landmine';

class Actions extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        Avern.State.actionData = [
            {
                id: "shoot_from_distance",
                label: "Shoot from a distance",
                description: ".",
                primeLength: 1,
                baseDamage: 10,
                range: 10,
                primed: false,
                input: "KeyF",
                requiresTarget: true,
                animation: "shoot",
                crucialFrame: 45,
            },
            {
                id: "blast_at_close_range",
                label: "Blast at close range",
                description: ".",
                primeLength: 2.5,
                baseDamage: 2,
                range: 20,
                primed: false,
                input: "KeyD",
                requiresTarget: true,
                animation: "shoot",
                crucialFrame: 45,
            },
            {
                id: "set_land_mine",
                label: "Set Landmine",
                description: "From the pouch at his waist, Heraclius takes an oily iron capsule trailing wires. Once placed in the earth, it can be detonated from a distance.",
                primeLength: 3.5,
                cooldown: 0,
                baseDamage: 40,
                range: 3,
                primed: false,
                input: "KeyS",
                requiresTarget: false,
                animation: "shoot",
                crucialFrame: 45,

            },
            {
                id: "null",
                label: "null",
                description: "",
                primeLength: 2,
                cooldown: 0,
                baseDamage: 0,
                range: 30,
                primed: false,
                input: "KeyA",
                locked: true,
                requiresTarget: false,
            },
        ]

        this.casting = false
        this.castingProgress = 0
        this.castingThreshold = 2
    }

    handleInputs() {
        const inputs = Avern.Inputs.getInputs()
        
        if ( inputs.action1 ) {
            this.handleAction(Avern.State.actionData[0],inputs)
        }
        if ( inputs.action2 ) {
            this.handleAction(Avern.State.actionData[1],inputs)
        }
        if ( inputs.action3 ) {
            this.handleAction(Avern.State.actionData[2],inputs)
        }
        if ( inputs.action4 ) {
            this.handleAction(Avern.State.actionData[3],inputs)
        }
    }

    handleAction(action,inputs) {
        if (action.locked) {
            this.emitSignal("show_notice", {notice: "Action locked", color: "yellow", delay: 2000})
            return;
        }
        if (action.primed) {
            this.doAction(action)
        } else if (this.casting && this.activeCast.id !== action.id) {
            if (inputs.forward || inputs.back) return;
            this.interruptCast()
            this.startCast(action)
        } else {
            if (inputs.forward || inputs.back) return;
            this.startCast(action)

        }
    }
    doAction(action) {
        if (!Avern.State.target && action.requiresTarget) {
            this.emitSignal("show_notice", {notice: "Target required", color: "red", delay: 2000})
            return;
        }
        action.primed = false

        this.emitSignal("action_availed", { action })
    }
    
    handleActionResult(actionId){
        const action = Avern.State.actionData.find(act => act.id===actionId)
        switch (actionId) {
            case "shoot_from_distance":
                if (!Avern.State.target) return
                this.emitSignal("receive_player_attack", {damage: action.baseDamage })
                break;
            case "blast_at_close_range":
                if (!Avern.State.target) return
                const distanceToTarget = Avern.Player.transform.position.distanceTo(Avern.State.target.transform.position)
                const calculatedDamage = calculateDamageByDistance(action.baseDamage, distanceToTarget, action.range, 2)
                this.emitSignal("receive_player_attack", {damage: calculatedDamage })
                break;
            case "set_land_mine":
                this.emitSignal("detonate_landmine")
                break;
        }
    }

    startCast(action) {
        this.casting = true
        this.activeCast = action
        this.emitSignal("casting_start")
        switch(action.id) {
            case "shoot_from_distance":
                Avern.Sound.reloadHandler.currentTime = 0
                Avern.Sound.reloadHandler.play()
              break;
            case "blast_at_close_range":
              break;
            case "propel_self_into_air":
              break;
            case "set_land_mine":
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

    reduceCast(percentage) {
        this.castingProgress = this.castingProgress * percentage
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
        Avern.State.actionData.forEach(act=>act.primed=false)
        action.primed = true
        this.emitSignal("casting_finish", { action })
        switch(action.id) {
            case "shoot_from_distance":
                Avern.Sound.reloadHandler.pause()
              break;
            case "blast_at_close_range":
              break;
            case "propel_self_into_air":
              break;
            case "set_land_mine":
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
    }

    onSignal(signalName, data) {
        switch(signalName) {
          case "walk_start":
            this.interruptCast()
            break;
          case "action_crucial_frame":
            this.handleActionResult(data.id)
            break;
          case "monster_casting_finish":
            if (this.activeCast) this.reduceCast(data.percentage)
            break;
        }
    }
    attachObservers(parent) {
        this.addObserver(Avern.Interface.getComponent(ActionBar))
        this.addObserver(Avern.Interface.getComponent(Notices))
        this.addObserver(parent.getComponent(Body))
        this.addObserver(parent.getComponent(Landmine))
        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
    }
}

export default Actions

function calculateDamageByDistance(baseDamage, distance, maxDistance, exponent=2) {
    
    // Calculate the scaled distance
    const scaledDistance = Math.min(distance / maxDistance, 1);
    
    // Calculate the damage based on the scaled distance and exponent
    const calculatedDamage = Math.min(baseDamage / Math.pow(scaledDistance, exponent),45);
    
    return calculatedDamage;
  }