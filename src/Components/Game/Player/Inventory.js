import * as THREE from 'three';
import gsap from "gsap"

import GameplayComponent from '../../_Component';

class Inventory extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
    }

    update() {
        const inputs = Avern.Inputs.getInputs()
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "item_pickup":
            Avern.State.inventory.push(data.item)
            break;
          case "player_heal":
            if (Avern.State.flaskCount > 0) Avern.State.flaskCount -= 1
            document.querySelectorAll('[data-flask]').forEach(el => el.innerHTML = Avern.State.flaskCount)
            break;
        }
    }
    
    attachObservers(parent) {

    }
}

export default Inventory