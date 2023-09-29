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
            break;
        }
    }
}

export default Inventory