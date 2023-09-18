import * as THREE from 'three';
import { writable } from 'svelte/store';

// sunday:
// NIGHT: level design / enemy design / other thing in blender
// gate / key / event !!!

// monday:
// pause menu []
// world state and triggers []
// modals []
// save states
// fountain menu []
// take a pass at stage resets and loads
// character menu incl action reassignment []


// NIGHT: level design

// tuesday:
// return to encounter design:
// - deal damage w/o target?
// - enemy projectiles
// - can rearrange actions
// - explosives kit and ceremonial dagger
// - gain xp
// enemy updates
// NIGHT: level design

// wednesday:
// continue encounter design, this should be the day with less coding and more "game design"
// NIGHT: level design

// thursday:
// cleanup and create github template
// connect to CMS
// blog posts and update personal website
// NIGHT: level design

// friday: JA
// NIGHT: level design


const Store = {
    player: writable({ 
        flasks: 5,
        hp: 100,
        level: 10,
        xp: 0,
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

    weapons: writable([
        {
            label: "Goatherd's Rifle",
            img: "",
            description: "",
            primary: "",
            actions: [
                {},
                {},
                {},
                {}
            ]
        },
        {
            label: "Explosives Kit",
            img: "",
            description: "",
            primary: "",
            actions: [
                {},
                {},
                {},
                {}
            ]
        },
        {
            label: "Ceremonial Dagger",
            img: "",
            description: "",
            primary: "",
            actions: [
                {},
                {},
                {},
                {}
            ]
        },
    ]),

    items: writable([
        {
            label: "Key to the gatehouse",
            img: ""
        }
    ]),

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