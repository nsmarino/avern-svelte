import Core from "./Core"
import GameObjects from "./GameObjects"
import Inputs from "./Inputs"
import Loader from "./Loader"
import State, { Store } from "./State"
import Sound from "./Sound"
import Config from "./Config"
import { Pathfinding, PathfindingHelper } from "three-pathfinding"

const Engine = {
    Core: new Core(),    
    GameObjects: new GameObjects(),
    Inputs: new Inputs(),
    Loader: new Loader(),
    Content: {},
    State: new State(),
    Sound: new Sound(),

    // All Caps for external libraries
    PATHFINDING: new Pathfinding(),
    PATHFINDINGHELPER: new PathfindingHelper(),

    Config,
    // Prototyping a store feature for ui updates
    Store
}

export default Engine