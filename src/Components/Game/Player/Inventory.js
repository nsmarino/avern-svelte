import GameplayComponent from '../../_Component';

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
            console.log("Item pickup", data)
            Avern.Store.items.update((items)=>{
              items.push(data.item)
              return items
            })
            // Avern.State.inventory.push(data.item)

            // temp:
            // Avern.State.flaskCount += 1
            // document.querySelectorAll('[data-flask]').forEach(el => el.innerHTML = Avern.State.flaskCount)
            // stateStore.update(st => {
            //     const updatedSt = {
            //         ...st,
            //         flaskCount: st.flaskCount + 1
            //     }
            //     return updatedSt
            // })
            break;
          // case "player_heal":
          //   if (Avern.State.flaskCount > 0) Avern.State.flaskCount -= 1
          //   document.querySelectorAll('[data-flask]').forEach(el => el.innerHTML = Avern.State.flaskCount)
            // stateStore.update(st => {
            //     const updatedSt = {
            //         ...st,
            //         flaskCount: st.flaskCount - 1
            //     }
            //     return updatedSt
            // })
            // break;
        }
    }
    
    // attachObservers(parent) {

    // }
}

export default Inventory