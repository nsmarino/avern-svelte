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

// - break -
    // update main menu (new game, load game)

// NIGHT: blender:

// wednesday:
    // can rearrange actions and pick up weapons; can save that
        // gain xp
    // can save xp from enemies []

// - break -
// NIGHT: enemies!

// thursday:
    // prototype various actions
        // can show tutorial modal and change hand config
    // can save if tutorial was shown and save hand config preference
    // show weapon tutorial

    // deal damage w/o target???
    // can save player position, health, flasks, current level state (which enemies are alive)
    // cleanup
    // NIGHT: more blender

// friday: 
// connect to cms
// cleanup and update github template for Avern Engine; 
// NIGHT: level design

// saturday:
// blog posts and update personal website

// sunday:
// job apps


// on hold:
    // AreaTrigger for lighting change?
    // enemy projectiles (arrows and slightly tracking magic)
    // leashing
    // break enemy into components
    // --- collider....actions...body...mind...
    // enemies should be slightly circling player as they get closer; enemies should move away from each other; enemies should pay attention to each others attacks

const Store = {}
export { Store }

class State {
    constructor(){
        this.playerDead = false

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