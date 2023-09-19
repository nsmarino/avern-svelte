import * as THREE from 'three';
import { writable } from 'svelte/store';

// MONDAY ---
    // fix flakiness of interaction prompt [x]
    // can pick up key [x]
    // can show key in inventory [x]
    // can open gate with key [x]

    // - break -



    // - break -

    // NIGHT: level design

// tuesday:
    // can save that picked up key []
    // can save that gate was opened []
    // can update interaction progress []
    // can save yoshua_haystack event []
// can go to another scene
// can go back to previous scene

// return to encounter design:
// - deal damage w/o target?
// - enemy projectiles
// - can rearrange actions
// - explosives kit and ceremonial dagger
// - gain xp
// can save xp from enemies []
// can rest at fountain []
// NIGHT: level design

// wednesday:

// - break -
// structural improvements
    // can save player position, health, flasks, current level state (which enemies are alive)
    // can show tutorial modal and change hand config
    // can save if tutorial was shown and save hand config preference
    // break enemy into components
// NIGHT: encounter design

// thursday:
// Game Design Baby
// NIGHT: More Game Design Baby

// friday: 
// connect to CMS
// cleanup and update github template for Avern Engine
// NIGHT: level design

// saturday:
// blog posts and update personal website

// const Store = {
//     scene: "url",

//     // just an array of IDs so the engine knows not to load them; cleared every time a scene is changed
//     killedEnemies:[],

//     player: writable({ 
//         flasks: 5,
//         hp: 100,
//         level: 10,
//         xp: 0,
//         location: null,
//     }),

//     pauseMenu: writable(false),
//     characterMenu: writable(false),

//     worldEvents: writable({
//         gateUnlocked: false,
//         esthelSaved: false,
//     }),

//     ongoingInteractions: [
//         {
//             label: "yoshua_haystack",
//             index: 0
//         }
//     ],

//     prompt: writable(""),
    
//     interaction: writable({
//         active: false,
//         node: {}
//     }),

//     config: writable({
//         leftHanded: true,
//     }),

//     weapons: writable([
//         {
//             label: "Goatherd's Rifle",
//             img: "",
//             description: "",
//             primary: "",
//             actions: [
//                 {},
//                 {},
//                 {},
//                 {}
//             ]
//         },
//         {
//             label: "Explosives Kit",
//             img: "",
//             description: "",
//             primary: "",
//             actions: [
//                 {},
//                 {},
//                 {},
//                 {}
//             ]
//         },
//         {
//             label: "Ceremonial Dagger",
//             img: "",
//             description: "",
//             primary: "",
//             actions: [
//                 {},
//                 {},
//                 {},
//                 {}
//             ]
//         },
//     ]),

//     items: writable([

//     ]),

//     actions: writable([
//         {
//             id: "shoot_from_distance",
//             label: "Shoot from a distance",
//             caption: "Loading rifle",
//             description: ".",
//             primeLength: 1,
//             baseDamage: 25,
//             range: 15,
//             primed: false,
//             input: "KeyF",
//             indicator: "F",
//             requiresTarget: true,
//             primeAnimation: "load",
//             animation: "shoot",
//         },
//         {
//             id: "bayonet_slash",
//             label: "Slash with bayonet",
//             description: "",
//             caption: "Affixing bayonet",
//             primeLength: 0.6,
//             cooldown: 0,
//             baseDamage: 10,
//             range: 5,
//             primed: false,
//             input: "KeyD",
//             indicator: "D",
//             requiresTarget: false,
//             primeAnimation: "load",
//             animation: "slash"
//         },
//         {
//             id: "set_land_mine",
//             label: "Set Landmine",
//             locked: true,
//             primeLength: 3,
//             cooldown: 0,
//             baseDamage: 40,
//             range: 3,
//             primed: false,
//             input: "KeyS",
//             indicator: "S",
//             requiresTarget: false,
//             primeAnimation: "plant",
//             animation: "detonate",
//         },
//         {
//             id: "blast_at_close_range",
//             label: "Blast at close range",
//             description: ".",
//             primeLength: 2.5,
//             baseDamage: 2,
//             locked: true,
//             range: 20,
//             primed: false,
//             input: "KeyA",
//             indicator: "A",
//             requiresTarget: true,
//             primeAnimation: "loadShotgun",
//             animation: "shotgun",
//         },
//         ]
//     ),

//     // simple array of interactions and notices
//     log: writable([]),

//     tutorials: writable([
//         {
//             label: "openingRemarks",
//             shown: false,
//         },
//         {
//             label: "weapons",
//             shown: false,
//         },
//     ])
// }
const Store = {}
export { Store }

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