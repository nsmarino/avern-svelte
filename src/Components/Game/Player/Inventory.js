import GameplayComponent from '../../_Component';
import { stateStore } from "../../../Engine/State"

class Inventory extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
    }

    // update() {
    //     const inputs = Avern.Inputs.getInputs()
    // }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "item_pickup":
            Avern.State.inventory.push(data.item)
            break;
          case "player_heal":
            // if (Avern.State.flaskCount > 0) Avern.State.flaskCount -= 1
            document.querySelectorAll('[data-flask]').forEach(el => el.innerHTML = Avern.State.flaskCount)
            console.log(stateStore)
            stateStore.update(st => {
                const updatedSt = {
                    ...st,
                    flaskCount: st.flaskCount - 1
                }
                return updatedSt
            })
            break;
        }
    }
    
    // attachObservers(parent) {

    // }
}

export default Inventory