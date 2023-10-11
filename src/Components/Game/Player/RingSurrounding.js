import GameplayComponent from '../../_Component';

class RingSurrounding extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.ringPositions = {
            north: "",
            northeast: "",
            northwest: "",
            east: "",
            west: "",
            southeast: "",
            southwest: "",
            south: "",
        }
    }

    update() {
        const inputs = Avern.Inputs.getInputs()
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "item_pickup":
            break;
        }
    }
}

export default RingSurrounding