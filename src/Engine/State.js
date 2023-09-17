import * as THREE from 'three';
import { writable } from 'svelte/store';

// Globally available State tracking stuff like HP, target, worldUpdateLocked...
const stateStore = writable({
    flaskCount: 5
})

// keyboard map [x]
// left/right config [x]

// today:
// pause menu []
// world state and triggers []
// modals []
// fountain menu []

// tomorrow:
// character menu []
// return to encounter design:
// - deal damage w/o target?
// - enemy projectiles
// - can rearrange actions
// - explosives kit and ceremonial dagger
// - xp

const Store = {
    player: writable({ 
        flasks: 5,
        hp: 100,
    }),

    pauseMenu: writable(false),
    characterMenu: writable(false),

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

    actions: writable([
        {
            id: "shoot_from_distance",
            label: "Shoot from a distance",
            caption: "Loading rifle",
            description: ".",
            primeLength: 1,
            baseDamage: 25,
            range: 15,
            primed: false,
            input: "KeyF",
            indicator: "F",
            requiresTarget: true,
            primeAnimation: "load",
            animation: "shoot",
        },
        {
            id: "bayonet_slash",
            label: "Slash with bayonet",
            description: "",
            caption: "Affixing bayonet",
            primeLength: 0.6,
            cooldown: 0,
            baseDamage: 10,
            range: 5,
            primed: false,
            input: "KeyD",
            indicator: "D",
            requiresTarget: false,
            primeAnimation: "load",
            animation: "slash"
        },
        {
            id: "set_land_mine",
            label: "Set Landmine",
            locked: true,
            primeLength: 3,
            cooldown: 0,
            baseDamage: 40,
            range: 3,
            primed: false,
            input: "KeyS",
            indicator: "S",
            requiresTarget: false,
            primeAnimation: "plant",
            animation: "detonate",
        },
        {
            id: "blast_at_close_range",
            label: "Blast at close range",
            description: ".",
            primeLength: 2.5,
            baseDamage: 2,
            locked: true,
            range: 20,
            primed: false,
            input: "KeyA",
            indicator: "A",
            requiresTarget: true,
            primeAnimation: "loadShotgun",
            animation: "shotgun",
        },
        ]
    ),

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