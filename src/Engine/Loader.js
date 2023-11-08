// LIBRARIES
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {writable, derived, get} from "svelte/store"
import sanityClient from "../sanityClient"
import * as YUKA from "yuka"
import { acceleratedRaycast } from 'three-mesh-bvh';
THREE.Mesh.prototype.raycast = acceleratedRaycast;
import gsap from "gsap"

import Content from "./Content"

// COMPONENTS
import Enemy from "../Components/Game/NonPlayer/Enemy";
import Targetable from "../Components/Game/NonPlayer/Targetable";
import Projectile from "../Components/Game/NonPlayer/Projectile";
import Interaction from "../Components/Game/NonPlayer/Interaction";
import ItemOnMap from "../Components/Game/NonPlayer/ItemOnMap";
import WeaponOnMap from "../Components/Game/NonPlayer/WeaponOnMap";
import Door from "../Components/Game/NonPlayer/Door";
import Connection from "../Components/Game/NonPlayer/Connection";
import Collider from "../Components/World/Collider";
import Sky from "../Components/World/Sky";
import Lights from "../Components/World/Lights";


// ASSETS:


class Loader {
    constructor() {
        this.scene = null
        this.collider = null
    }

    async loadContent(useSavedGame) {
      const query = `*[_type == "settings"]{
        "mesh": mesh.asset->url,
      }`
      const responseFromSanity = await sanityClient.fetch(query)
      Avern.Content = Content

      // state of affairs on init
      this.newGameStore = {
        scene: "url",
        player: { 
            flasks: 1,
            fruit: 0,
            hp: 100,
            maxHp: 100,
            energy: 50,
            maxEnergy: 100,
            level: 10,
            xp: 0,
            location: null,
        },
    
        pauseMenu: false,
        characterMenu: false,
    
        worldEvents: {
          // these will be checked against for interactions etc
            gateUnlocked: false,
            keyRetrieved: false,
            esthelSaved: false,
        },
    
        ongoingInteractions: {},
          // save index of various interactions
          // "yoshua_haystack": 1
    
        prompt: "",
        
        interaction: {
            active: false,
            node: {}
        },
    
        config: {
            leftHanded: window.avernKeyboardConfig==="left",
        },
    
        weapons: [
        ],
    
        items: [],

        // simple array of interactions and notices
        log: [],
        openingRemarksVisible: false,
        endOfDemoVisible: false,
        openingRemarksShown: true,
        endOfDemoShown: false,
      }

      const store = useSavedGame ? JSON.parse(localStorage.getItem("AvernStore")) : this.newGameStore
      for (const [key, value] of Object.entries(store)) {
        Avern.Store[key] = writable(value)

        // store for actions:
        if (key==="weapons") {
          Avern.Store["actions"] = derived(Avern.Store[key], (weapons)=> {
            const actions = []
            weapons.forEach(weapon => {
              weapon.actions.forEach(action => {
                  actions.push(action)
                  if (!action.assignment) action.assignment = actions.indexOf(action)+1
                  action.inputKey = action.assignment <= 4 ? "l" : "r"
                  if (action.assignment <= 4) {
                    switch (action.assignment) {
                      case 1:
                        action.inputKeyLeft = "F"
                        action.inputKeyRight = "J"
                        break;
                      case 2:
                        action.inputKeyLeft = "D"
                        action.inputKeyRight = "K"
                        break;
                      case 3:
                        action.inputKeyLeft = "S"
                        action.inputKeyRight = "L"
                        break;
                      case 4:
                        action.inputKeyLeft = "A"
                        action.inputKeyRight = ";"
                        break;
                    }
                  }
              })
            })
            
            actions.sort((a, b) => (a.assignment > b.assignment) ? 1 : -1)

            // I could make the actions array contain ALL actions, each having an assignment integer.
            // Can then use the integer from the dragging to update Store.weapons, which will
            // in turn update Store.actions
            return actions
          })
        }
      }
      Avern.Store.pauseMenu.set(false)
    }

    async initScene(to) {
      const scene = new THREE.Scene();
      scene.name = to ? to : "Start"
      Avern.State.scene = scene
      
      const sky = Avern.GameObjects.createGameObject(scene, "sky")
      sky.addComponent(Sky)

      const lights = Avern.GameObjects.createGameObject(scene, "lights")
      lights.addComponent(Lights)

      if (Avern.Content.baseFile) {
        const res = await new GLTFLoader().loadAsync(Avern.Content.baseFile)
        const gltfScene = res.scene;
        gltfScene.updateMatrixWorld( true );
        // Avern.yukaNavmesh = await this.initNavmesh(yukaPaths)
        const collider = Avern.GameObjects.createGameObject(scene, "collider")
        collider.addComponent(Collider, gltfScene)
  
        this.initNonPlayerFromBaseFile(gltfScene,scene)
      }

      if (Avern.Config.player.include) this.initPlayer(scene, to)
      if (Avern.Config.interface.include) this.initInterface(scene)

    }

    async initNavmesh(file) {
			const loader = new YUKA.NavMeshLoader();
      const navmesh = await loader.load(file)

      // const shownav = await new GLTFLoader().loadAsync(file)
      // Avern.State.scene.add(shownav.scene)
      // shownav.scene.children[0].material.wireframe = true

      return navmesh
    }

    initNonPlayerFromBaseFile(baseFile, scene) {
      const currentWorldEvents = get(Avern.Store.worldEvents)

      baseFile.traverse(c => {
        if (c.userData.gltfExtensions?.EXT_collections?.collections) {
          switch(c.userData.gltfExtensions.EXT_collections.collections[0]) {
            case "enemies":
              if (!c.userData.label) return;
              const enemy = Avern.GameObjects.createGameObject(scene, c.name)                        
              enemy.addComponent(Enemy, c)
              // enemy.canBeTargeted = true
              // enemy.addComponent(Targetable, true, 1)
              if (c.userData.label==="bow") enemy.addComponent(Projectile)
              break;

            case "leave":
              const connection = Avern.GameObjects.createGameObject(scene, c.name)                        
              connection.addComponent(Connection, c)
              // connection.canBeTargeted = true
              // connection.addComponent(Targetable, false, 2)

              break;
            case "arrive":
              const from = Avern.GameObjects.createGameObject(scene, c.userData.label)  
              from.transform.position.copy(c.position)
              from.transform.rotation.copy(c.rotation)
              break;

            case "interactions":
              const interactionContent = Avern.Content.interactions.find(int => int.label === c.userData.label)
              if (interactionContent) {
                let shouldSpawnInteraction = true
                for (const condition of interactionContent.worldConditions) {
                  if(currentWorldEvents[condition.id]!==condition.value) shouldSpawnInteraction = false
                }

                if (shouldSpawnInteraction) {
                  const interaction = Avern.GameObjects.createGameObject(scene, c.name)
                  interaction.addComponent(Interaction, c, interactionContent)
                  // interaction.canBeTargeted = true
                  // interaction.addComponent(Targetable, false, 1)
    
                }                
              }
              break;

            case "items":
                const itemContent = Avern.Content.items.find(i => i.label === c.userData.label)
                const currentItems = get(Avern.Store.items)

                if (itemContent) {
                  let shouldSpawnItem = true
                  if (currentItems.find(i => i.id===itemContent.label)) shouldSpawnItem = false

                  if (shouldSpawnItem) {
                    const itemOnMap = Avern.GameObjects.createGameObject(scene, c.name)
                    itemOnMap.addComponent(ItemOnMap, c, itemContent)
                    // itemOnMap.canBeTargeted = true
                    // itemOnMap.addComponent(Targetable, false, 1 )
      
                  }                
                }                
              break;

            case "doors":
              const doorContent = Avern.Content.doors.find(g => g.label === c.userData.label)
              if (c.userData.label === "rear-entrance" && currentWorldEvents.gateUnlocked) return
              const door = Avern.GameObjects.createGameObject(scene, c.name)

              door.addComponent(Door, c, doorContent)
              // door.canBeTargeted = true
              // door.addComponent(Targetable, false, 5)

              break;

            default:
              break;
          }
        }
      });
    }

    initPlayer(scene, to) {
      const player = Avern.GameObjects.createGameObject(scene, "player")
      Avern.Player = player
      for (const component of Avern.Config.player.components) {
          player.addComponent(component, to)
      }
    }

    initInterface(scene) {
      const gameInterface = Avern.GameObjects.createGameObject(scene, "interface")
      Avern.Interface = gameInterface
      for (const component of Avern.Config.interface.components) {
          gameInterface.addComponent(component)
      }
    }

    async switchScene(toLabel){
      Avern.GameObjects.removeAllGameObjects()

      // TEMP: clean up dom els (stupidly)
      document.querySelectorAll(".order-container, .numbers-container, .enemy-bar").forEach(el => el.remove())
      
      // switch(toLabel) {
      //   case "courtyard-path": 
      //   case "courtyard-gate": 
      //   case "haystack": 
      //   case "player-restart":
      //     Avern.Sound.playSceneMusic("courtyard", 0.05)

      //     Avern.Content.baseFile=demoCourtyard
      //     Avern.Store.player.update(player =>
      //       {
      //         const updatedPlayer = {
      //           ...player,
      //           hp: player.maxHp
      //         }
      //         return updatedPlayer
      //       })
      //     break;
      //   case "cliffs-start":
      //   case "cliffs-end": 
      //     Avern.Sound.playSceneMusic("cliffs", 0.1)
      //     Avern.Content.baseFile=demoCliffs
      //     break;
      //   case "swamp-start": 
      //   Avern.Sound.playSceneMusic("swamp", 0.1)
      //     Avern.Content.baseFile=demoSwamp
      //     break;
      // }

      // await this.initScene(toLabel)
      // Avern.GameObjects.attachObservers() // Listen for signals from other gameObjects' components.

    }
    
}

export default Loader