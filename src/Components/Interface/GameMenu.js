import GameplayComponent from '../_Component';
import {get} from 'svelte/store'
class GameMenu extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
    }

    update() {
        const inputs = Avern.Inputs.getInputs()
        if ( inputs.pauseMenu ) this.openGameMenu()
        if ( inputs.characterMenu ) this.openCharacterMenu()
    }

    openGameMenu(){
        console.log("Opening game menu")
        if (get(Avern.Store.pauseMenu)) {
            Avern.Store.pauseMenu.set(false)
            Avern.State.worldUpdateLocked = false
        } else {
            Avern.Store.pauseMenu.set(true)
            Avern.State.worldUpdateLocked = true
        }
    }

    openCharacterMenu(){
        if (get(Avern.Store.characterMenu)) {
            Avern.Store.characterMenu.set(false)
            Avern.State.worldUpdateLocked = false
        } else {
            Avern.Store.characterMenu.set(true)
            Avern.State.worldUpdateLocked = true
        }    
    }


}

export default GameMenu