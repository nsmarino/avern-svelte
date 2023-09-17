import * as THREE from 'three';
import { writable } from 'svelte/store';

// Globally available State tracking stuff like HP, target, worldUpdateLocked...
const stateStore = writable({
    flaskCount: 5
})

// Store Interaction content here
// Use it in a svelte component
// Understand svelte store better
// keyboard map
// left/right config
// modals
// pause menu
// fountain menu
// character menu
// main menu and intro text
// audit index.html for other things to replace

const Store = {
    player: writable({ 
        flasks: 5,
        hp: 100,
    }),
    simple: writable(true),

    worldEvents: writable({
        foo: true,
        bar: false,
    }),

    prompt: writable(""),
    
    interaction: writable({
        active: false,
        node: {}
    }),

    config: writable({
        leftHanded: true,
    }),

    inventory: writable({
        weapons: [],
        items: []
    }),

    actions: writable({
        action1: {},
        action2: {},
        action3: {},
        action4: {},
    }),

    info: writable({
        log: [],
        tips: []
    })
}

export { stateStore, Store }

class State {
    constructor(){
        this.playerDead = false

        this.flaskCount = 5

        // populated by Loader (e)
        this.scene = null
        this.camera = new THREE.PerspectiveCamera(
            50, window.innerWidth / window.innerHeight
        ),
        this.worldUpdateLocked = false

        // populated by Loader (e)
        this.inventory = []


        // Revisit this:
        // populated by Loader (e)
        this.Enemies = [

        ]

        this.visibleEnemies = [

        ]
        this.targetIndex = 0
        this.target = null
    }
}

export default State