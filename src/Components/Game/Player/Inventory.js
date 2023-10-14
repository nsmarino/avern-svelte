import GameplayComponent from '../../_Component';

class Inventory extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
    }


    onSignal(signalName, data={}) {
        switch(signalName) {
          case "item_pickup":
            console.log("Item pickup", data)
            if (data.item.category === "flask") {
              // Can be dropped by enemies
              console.log("Increase flask!")
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  flasks: player.flasks + 1,
                }
                return updatedPlayer
              })
            } else if (data.item.category === "fruit") {
              // Can only be found in environment or purchased
              console.log("Increase fruit!")
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  fruit: player.fruit + 1,
                }
                return updatedPlayer
              })
            } else {
              Avern.Store.items.update((items)=>{
                items.push(data.item)
                return items
              })              
            }

            break;
        }
    }
}

export default Inventory