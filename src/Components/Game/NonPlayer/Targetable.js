import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Body from '../Player/Body';

class Targetable extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        this.gameObject = gameObject
    }

    update() {

    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "example_signal":
            console.log("Example signal", data)
            break;
        }
    }
    
    attachObservers(parent) {
        this.addObserver(Avern.Player.getComponent(Body))
    }
}

export default Targetable
