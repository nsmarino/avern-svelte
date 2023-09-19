import * as THREE from 'three';
import { writable } from 'svelte/store';

// MONDAY ---
    // fix flakiness of interaction prompt [x]
    // can pick up key [x]
    // can show key in inventory [x]
    // can open gate with key [x]
    
    // result: In addition to a ton of groundwork for fully-functioning menus,
    // I greatly expanded the Store feature and the way it is integrated into the engine. 
    // I can now save and load Store, although I still need to implement reading 
    // from saved Store on initialization. I think I've also better content structuring
    // for the reintroduction of management via Sanity.

    // NIGHT: level design

// tuesday:
// ive set up the init condition stuff but i now need
    // can save that picked up key [x]
    // can save that gate was opened [x]
    // can update interaction progress [x]
// - break -
    // can go to another scene
    // can go back to previous scene
// - break -
    // can rearrange actions and pick up weapons; can save that

// - break -
    // update main menu (new game, load game)
    // can show tutorial modal and change hand config
    // can save if tutorial was shown and save hand config preference

// NIGHT: blender:
// create new enemy models

// wednesday:
    // prototype various actions
    // deal damage w/o target???
    // gain xp
    // can save xp from enemies []
// - break -
// NIGHT: encounter design

// thursday:
    // can save player position, health, flasks, current level state (which enemies are alive)
    // connect to cms
    // cleanup
    // trigger for lighting change?
    // NIGHT: more blender

// friday: 
// cleanup and update github template for Avern Engine; blog posts and update personal website
// NIGHT: level design

// saturday:
// job apps


// on hold:
    // enemy projectiles (arrows and slightly tracking magic)
    // break enemy into components
    // --- collider....actions...body...mind...
    // enemies should be slightly circling player as they get closer; enemies should move away from each other; enemies should pay attention to each others attacks


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