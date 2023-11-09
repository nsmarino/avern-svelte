import Core from "./Core"
import GameObjects from "./GameObjects"
import Inputs from "./Inputs"
import Loader from "./Loader"
import State, { Store } from "./State"
import Sound from "./Sound"
import Config from "./Config"

const Engine = {
    Core: new Core(),    
    GameObjects: new GameObjects(),
    Inputs: new Inputs(),
    Loader: new Loader(),
    Content: {},
    State: new State(),
    Sound: new Sound(),
    Config,
    Store,
    World: {}, // will be Physics 
}

export default Engine