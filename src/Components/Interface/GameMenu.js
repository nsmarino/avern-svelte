import gsap from "gsap"
import GameplayComponent from '../_Component';

// import { Equipment, Inventory, Attributes } from "../jsx/GameMenu"
// this.gm_equipment = document.querySelector("#game-menu .equipment")
// this.gm_equipment.replaceChildren(Equipment())

class GameMenu extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        this.gm = document.querySelector("#game-menu")
        this.cm = document.querySelector("#character-menu")
        this.gmActive = false
        this.cmActive = false
    }

    update() {
        const inputs = Avern.Inputs.getInputs()
        if ( inputs.pauseMenu ) {
            if (!this.gmActive) {
                this.openGameMenu()
            }
            else {
                this.closeGameMenu()
            }
        }    
        if ( inputs.characterMenu ) {
            if (!this.cmActive) {
                this.openCharacterMenu()
            }
            else {
                this.closeCharacterMenu()
            }
        }    
    }

    openGameMenu(){
        Avern.State.worldUpdateLocked = true
        this.gmActive = true
        gsap.set(this.gm, {opacity: 1, pointerEvents: "auto"})
    }

    closeGameMenu(){
        this.gmActive = false
        gsap.set(this.gm, {opacity: 0, pointerEvents: "none"})
        Avern.State.worldUpdateLocked = false
    }
    openCharacterMenu(){
        Avern.State.worldUpdateLocked = true
        this.cmActive = true
        gsap.set(this.cm, {opacity: 1, pointerEvents: "auto"})
    }

    closeCharacterMenu(){
        this.cmActive = false
        gsap.set(this.cm, {opacity: 0, pointerEvents: "none"})
        Avern.State.worldUpdateLocked = false
    }
}

export default GameMenu