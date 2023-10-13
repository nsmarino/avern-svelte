import sanityClient from "../sanityClient"

import demoCourtyard from "../../assets/levels/demo-courtyard.gltf"
import demoCliffs from "../../assets/levels/demo-cliffs.gltf"
import demoSwamp from "../../assets/levels/demo-swamp.gltf"
import yukaPaths from "../../assets/levels/my-navmesh.gltf"
import yukaLevel from "../../assets/levels/my-level.gltf"
import {writable, derived, get} from "svelte/store"
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import yoshuaHaystack from "../../assets/npcs/yoshua_haystack.gltf"
import gatekeeperDismayed from "../../assets/npcs/fse--gatekeeper.gltf"

import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import * as YUKA from "yuka"

import { acceleratedRaycast } from 'three-mesh-bvh';
import gsap from "gsap"
import weaponImg from "../../assets/ui/weapon.svg"
import aimedShot from "../../assets/ui/aimed-shot.svg"
import bayonet from "../../assets/ui/bayonet.svg"
import muzzleBlast from "../../assets/ui/muzzle-blast.svg"
import propelSelf from "../../assets/ui/propel-self.svg"
THREE.Mesh.prototype.raycast = acceleratedRaycast;

import Enemy from "../Components/Game/NonPlayer/Enemy";
import Projectile from "../Components/Game/NonPlayer/Projectile";

import Interaction from "../Components/Game/NonPlayer/Interaction";

// import Fountain from "../Components/Game/NonPlayer/Fountain";
import ItemOnMap from "../Components/Game/NonPlayer/ItemOnMap";
import WeaponOnMap from "../Components/Game/NonPlayer/WeaponOnMap";
import Gateway from "../Components/Game/NonPlayer/Gateway";
import Connection from "../Components/Game/NonPlayer/Connection";

import Collider from "../Components/World/Collider";
import Sky from "../Components/World/Sky";
import Lights from "../Components/World/Lights";

import yoshuaAlert from "../../assets/portraits/yoshua/alert.svg"
import yoshuaHappy from "../../assets/portraits/yoshua/happy.svg"
import yoshuaSerious from "../../assets/portraits/yoshua/serious.svg"
import gatekeeperPortrait from "../../assets/portraits/gatekeeper/default.svg"
import smithmasterPortrait from "../../assets/portraits/smithmaster/default.svg"
import esthelPortrait from "../../assets/portraits/esthel/default.svg"

class Loader {
    constructor() {
        this.scene = null
        this.collider = null
    }

    async loadFromCMS(useSavedGame) {
      const query = `*[_type == "settings"]{
        "mesh": mesh.asset->url,
      }`
      const responseFromSanity = await sanityClient.fetch(query)

      // 'content' should only be interested in what's present the actual scene file. the Store is used to determine what actually spawns in the game
      Avern.Content = {
        baseFile: yukaLevel,
        items:[
          {
            label: "rear-entrance",
            item: {
              name: "Key to the Gatehouse",
              img: "",
              id: "rear-entrance",
              category: "key",
            }
          },
          {
            label: "cage-key",
            item: {
              name: "Cage Key",
              img: "",
              id: "cage-key",
              category: "key",
            }
          },
          {
            label: "healing-flask",
            item: {
              name: "Healing Flask",
              category: "flask"
            }
          }
        ],
        interactions:[
          {
            label: "yoshua-haystack",
            index: 0,

            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:true}
            ],
            model: yoshuaHaystack,
            anim: "SIT",
            content: [
              {
                prompt: "Talk to the drowsy interloper",
                nodes:[
                  {
                  type: "dialogue",
                  text: "Ah...is this your haystack? I couldn't resist...I have been running all night.",
                  image: yoshuaAlert,
                  label: "Drowsy interloper",
                  },
                  {
                    type: "narration",
                    image: yoshuaAlert,
                    text: "He is a curly haired and delicate adolescent, about your age. His cheeks are flushed with the cold morning air and there is a stalk of hay sticking out of his ear.",
                  },
                  {
                      type: "dialogue",
                      text: "I am in your debt...are you a castrate? That mask...it is so hard to know if you are angry!",
                      image: yoshuaAlert,
                      label: "Drowsy interloper",
                  },
                  {
                      type: "dialogue",
                      text: "Forgive me! I mean no offense. I am very tired. I was captured by slavers...",
                      image: yoshuaHappy,
                      label: "Drowsy interloper",
                  },
                  {
                      type: "dialogue",
                      text: "I am Yoshua. I come from the capital. I was taken there -- along with my sister.",
                      image: yoshuaAlert,
                      label: "Yoshua, fugitive",
                  },
                  {
                    type: "narration",
                    text: "He frowns and glances downward. His strange cheeriness melts away.",
                    image: yoshuaSerious,
                  },
                  {
                      type: "dialogue",
                      text: "My sister...they still have her. In a palanquin, deep in the swamp. Would you help me, castrate? I am at your mercy.",
                      image: yoshuaSerious,
                      label: "Yoshua, fugitive",
                      trigger: "help_yoshua"
                  },
                  {
                    type: "dialogue",
                    text: "I have little I can offer you...I stole this dagger when I fled. Perhaps you are more skilled with it than I.",
                    image: yoshuaSerious,
                    label: "Yoshua, fugitive",
                  },
                  {
                      type: "weapon",
                      text: "You have received [Ceremonial Dagger].",
                      weapon: "ceremonial_dagger",
                      image: yoshuaSerious,
                  },
                ]
              },
              {
                prompt: "Talk to Yoshua",
                trigger: null,
                next: null,
                nodes: [
                  {
                    type: "dialogue",
                    text: "I'm so happy you will help me! Let's make for the swamp...the slavers have their camp there. That is where my sister is imprisoned.",
                    image: yoshuaHappy,
                    label: "Yoshua, fugitive",
                  }
                ]
              },
            ],
          },
          {
            label: "gatekeeper-dismayed",
            index: 0,
            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:false}
            ],
            model: gatekeeperDismayed,
            anim: "SIT",
            content: [
              {
                prompt: "Talk to gatekeeper",
                nodes:[
                  {
                  type: "dialogue",
                  text: "Woe!",
                  image: gatekeeperPortrait,
                  },
                  {
                    type: "narration",
                    image: gatekeeperPortrait,
                    text: "The gatekeeper is very upset.",
                  },
                  {
                      type: "dialogue",
                      text: "Child, I have forgotten the key to the gatehouse's rear entrance...ah..shackles and woe!",
                      image: gatekeeperPortrait,
                      label: "Gatekeeper",
                  },
                  {
                      type: "dialogue",
                      text: "Will you go to the gatehouse and retrieve it for me? You will have to take the cliff path.",
                      image: gatekeeperPortrait,
                      label: "Gatekeeper",
                  },
                  {
                      type: "dialogue",
                      text: "Here, I have fixed the scope on your rifle. Please...be careful.",
                      image: gatekeeperPortrait,
                      label: "Gatekeeper",
                  },
                  {
                    type: "weapon",
                    text: "You have received [Goatherd's Rifle]. Hover the cursor over the keyboard map below to learn more.",
                    weapon: "goatherd-rifle",
                    image: gatekeeperPortrait,
                  },
                  {
                    type: "narration",
                    text: "The cliff path is dangerous and at times veers into the Old Town. You will need to be very careful...but the gatekeeper could really use your help.",
                    image: gatekeeperPortrait,
                  },
                  {
                      type: "dialogue",
                      text: "Thank you, child! I shall pray for your safe return.",
                      image: gatekeeperPortrait,
                      label: "Gatekeeper",
                  },
                ]
              },
              {
                prompt: "Talk to the gatekeeper",
                nodes: [
                  {
                    type: "narration",
                    text: "The gatekeeper is very upset. He will keep fretting until you have unlocked the rear entrance to the gatehouse.",
                    image: gatekeeperPortrait,
                  }
                ]
              },
            ],
          },
          {
            label: "gatekeeper-relieved",
            index: 0,

            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:true}
            ],
            model: gatekeeperDismayed,
            anim: "STAND",

            content: [
              {
                prompt: "Talk to the gatekeeper",
                nodes: [
                  {
                    type: "dialogue",
                    text: "Thank you, child! How proud I am of you.",
                    image: gatekeeperPortrait,
                    label: "Relieved gatekeeper",
                  }
                ]
              },
            ],
          },
          {
            label: "smithmaster-morning",
            index: 0,

            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:true}
            ],
            model: yoshuaHaystack,
            anim: "SIT",

            content: [
              {
                prompt: "Talk to the smithmaster",
                nodes: [
                  {
                    type: "dialogue",
                    text: "Are you helping that old fool again, castrate? Tend to your goats and leave him to his tottering about.",
                    image: smithmasterPortrait,
                    label: "Smithmaster",
                  },
                  {
                    type: "dialogue",
                    text: "If we are lucky, perhaps he will totter off a cliff and we will all be freed from his whining.",
                    image: smithmasterPortrait,
                    label: "Smithmaster",
                  },
                  {
                    type: "dialogue",
                    text: "Besides, those goats of yours have been been screeching since the sun rose. Run along and see what the matter is with them -- they keep me from my work.",
                    image: smithmasterPortrait,
                    label: "Smithmaster",
                  },
                ]
              },
            ],
          },
          {
            label: "goat-eating",
            index: 0,

            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:false}
            ],
            model: yoshuaHaystack,
            anim: "SIT",

            content: [
              {
                prompt: "Look at the goats",
                nodes: [
                  {
                    type: "narration",
                    text: "The goats are happily munching away on the fresh swampgrass. They won't be moving anytime soon.",
                    label: "The Goats",
                  }
                ]
              },
            ],
          },
          {
            label: "esthel-captive",
            index: 0,

            // check when scene is loaded; also check on world_state_changed signal
            // if world conditions don't all match, destroy
            worldConditions: [
              {id:"keyRetrieved", value:true}
            ],
            model: yoshuaHaystack,
            anim: "SIT",

            content: [
              {
                prompt: "Talk to the captive",
                nodes: [
                  {
                    type: "dialogue",
                    text: "What are you?",
                    image: esthelPortrait,
                    label: "Captive girl",
                  },
                  {
                    type: "narration",
                    text: "Her voice is clear and her tone imperious. Her skin has the same alabaster sheen as her brother's, but her eyes are icy and steady. You have opened the cage but she does not move.",
                    image: esthelPortrait,
                    label: "Captive girl",
                  },
                  {
                    type: "dialogue",
                    text: "Ah, I see. You are a castrate. I was not aware that castrates were still in use.",
                    image: esthelPortrait,
                    label: "Captive girl",
                  },
                  {
                    type: "narration",
                    text: "She regards you a moment longer, studying the contours of your mask. Her eyes catch the copper dagger on your belt",
                    image: esthelPortrait,
                    label: "Captive girl",
                  },
                  {
                    type: "dialogue",
                    text: "You carry the Spring's Blade. You have met my brother? I am Esthel. Will you bring me to Yoshua, castrate?",
                    image: esthelPortrait,
                    label: "Esthel",
                  },
                  {
                    type: "narration",
                    text: "Her eyes finally snap away from you. She examines her cage with a brisk finality, as if noting which memories of her imprisonment to carry with her and which to leave behind.",
                    image: esthelPortrait,
                    label: "Esthel",
                  },
                  {
                    type: "dialogue",
                    text: "You have freed me from my captors. I thank you, castrate. Bring me to my brother.",
                    image: esthelPortrait,
                    label: "Esthel",
                  },
                ]
              },
            ],
          },
        ],
        // you receive ceremonial dagger from yoshua.
        // you get the rifle from the gatekeeper w weapon tutorial popup
        weapons: [
          {
            label: "goatherd-rifle",
            name: "Goatherd's Rifle",
            id: "goatherd-rifle",
            image: weaponImg,
            description: "Given to you by the Gatekeeper for fending off antwolves in the hills",
            setBonus: "sure_footed",
            actions: [
              {
                id: "shoot_from_distance",
                label: "Precision Shot",
                caption: "Loading rifle",
                image: aimedShot,
                description: "You eyes narrow and time seems to slow. Causes additional bleed damage.",
                primeLength: 1.75,
                baseDamage: 35,
                cost: 20,
                isInstant: false,
                range: 40,
                primed: false,
                assignment: null,
                primeAnimation: "load",
                animation: "shoot",
                primaryModifier: "Faith",
                secondaryModifier: "Cruelty",
              },
              {
                id: "bayonet_slash",
                label: "Slash with bayonet",
                description: "A quick slice with the bayonet attachment on the rifle.",
                image: bayonet,
                caption: "Affixing bayonet",
                primeLength: 0.6,
                isInstant: true,
                cost: 33,
                baseDamage: 40,
                modifier:0.15,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "load",
                animation: "slash",
                primaryModifier: "Faith",
                secondaryModifier: "Cruelty",
              },
              {
                id: "rapid_fire",
                label: "Impact Shot",
                caption: "Loading rifle",
                description: "The sound of the rifle blast rings in your ears and the acrid smoke fills your nostrils. Causes slowdown.",
                primeLength: 1,
                baseDamage: 20,
                cost: 10,
                image: muzzleBlast,
                range: 30,
                primed: false,
                isInstant: false,
                locked: true,
                assignment: null,
                primeAnimation: "load",
                animation: "fire",
                primaryModifier: "Faith",
                secondaryModifier: "Bravado",
              },
              {
                id: "rifle_club",
                label: "Club with butt of rifle",
                description: "Stuns enemy for 3 seconds or until attacked.",
                caption: "Shifting weight",
                primeLength: 0.6,
                image: propelSelf,
                cost: 50,
                baseDamage: 0,
                isInstant: true,
                locked: true,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "load",
                animation: "club",
                primaryModifier: "Faith",
                secondaryModifier: "Bravado",
              },
            ]
          },
          {
            name: "Ceremonial Dagger",
            label: "ceremonial_dagger",
            id: "ceremonial-dagger",
            image: weaponImg,
            description: "Although free from ornamentation, this simple copper blade is warm to the touch. It seems to pulsaate in your hand.",
            primary: "Cruelty",
            actions: [
              {
                id: "lose_yourself",
                label: "Lose yourself in the blade",
                caption: "Standing on the precipice",
                description: "Give yourself over to the churning current inside the blade. Increases attack and reduces defense for 5 seconds.",
                image: weaponImg,
                primeLength: 1,
                baseDamage: 25,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "withdraw",
                animation: "lose_yourself",
                primaryModifier: "Cruelty",
                secondaryModifier: "Bravado",
              },
              {
                id: "open_artery",
                label: "Open artery",
                caption: "Honing blade",
                description: "Dart in with the blade. A steady stream of blood springs forth.",
                image: weaponImg,
                primeLength: 1,
                baseDamage: 25,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "withdraw",
                animation: "open_artery",
                primaryModifier: "Cruelty",
                secondaryModifier: "Guile",
              },
              {
                id: "Stun with pommel",
                label: "Stun with pommel",
                caption: "Gathering strength",
                description: "Bonk an enemy on the head, stunning them for 10 seconds or until they receive damage.",
                image: weaponImg,
                primeLength: 1,
                baseDamage: 25,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "withdraw",
                animation: "pommel_smack",
                primaryModifier: "Cruelty",
                secondaryModifier: "Guile",
              },
              {
                id: "stab_in_frenzy",
                label: "Stab in a frenzy",
                caption: "Working up a thirst",
                description: "Strike quickly, high chance of critical hit but reduces defense for 3 seconds.",
                image: weaponImg,
                secondary: "",
                primeLength: 1,
                baseDamage: 25,
                range: 5,
                primed: false,
                assignment: null,
                primeAnimation: "withdraw",
                animation: "thrust_slash",
                primaryModifier: "Cruelty",
                secondaryModifier: "Bravado",
              },
            ]
          },
        ],
        enemies:[
        ],
        gates:[
          {
            label: "rear-entrance",
            prompt: "Open rear door of gatehouse",
            unlockedBy: "rear-entrance"
          },
          {
            label: "prisoner-cage",
            prompt: "Open cage",
            unlockedBy: "cage-key"
          },
        ],
      }

      this.newGameStore = {
        scene: "url",
    
        player: { 
            flasks: 5,
            fruit: 2,
            hp: 100,
            maxHp: 100,
            energy: 100,
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
        combatTutorialVisible:  false,
        endOfDemoVisible: false,
        openingRemarksShown: true,
        combatTutorialShown:  false,
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
        Avern.yukaNavmesh = await this.initNavmesh(yukaPaths)
        const collider = Avern.GameObjects.createGameObject(scene, "collider")
        collider.addComponent(Collider, gltfScene)
  
        this.initNonPlayerFromBaseFile(gltfScene,scene)
      }

      if (Avern.Config.player.include) this.initPlayer(scene, to)
      if (Avern.Config.interface.include) this.initInterface(scene)
      // if (!get(Avern.Store.openingRemarksShown)) {
      //   setTimeout(() => {
      //     Avern.Store.openingRemarksVisible.set(true)
      //     Avern.Store.openingRemarksShown.set(true)
      //   }, 3000)
      // }
    }

    async initNavmesh(file) {
			const loader = new YUKA.NavMeshLoader();
      // console.log("Yuka navmesh loader:", loader)
      const navmesh = await loader.load(file)
      // const shownav = await new GLTFLoader().loadAsync(file)

      // Avern.State.scene.add(shownav.scene)
      // console.log(shownav.scene.children[0].material.wireframe = true)
      // console.log("NAVMESH FROM YUKA", navmesh)
      return navmesh
      // loader.load( yukaPaths ).then( ( navigationMesh ) => {
      //   console.log(navigationMesh)
      //   Avern.yukaNavmesh = navigationMesh
      // })

      // const navmesh = baseFile.children.filter(child=> child.isMesh && child.userData.gltfExtensions.EXT_collections.collections[0]==="navmesh")[0]
      // if (!navmesh) return;
      // Avern.pathfindingZone = baseFile.name
      // Avern.PATHFINDING.setZoneData(Avern.pathfindingZone, Pathfinding.createZone(navmesh.geometry));
      // // visualize:
      // for (const vert of Avern.PATHFINDING.zones[baseFile.name].vertices) {
      //     const indicatorSize = 0.1 
      //     const geometry = new THREE.BoxGeometry( indicatorSize,indicatorSize,indicatorSize); 
      //     const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
      //     const cube = new THREE.Mesh( geometry, material ); 
      //     cube.position.copy(vert)
      //     scene.add( cube );
      // }
      // navmesh.visible = false
      // scene.add(navmesh)
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
              if (c.userData.label==="bow") enemy.addComponent(Projectile)
              break;

            case "fountains":
              break;

            case "leave":
              const connection = Avern.GameObjects.createGameObject(scene, c.name)                        
              connection.addComponent(Connection, c)
              break;
            case "arrive":
              const from = Avern.GameObjects.createGameObject(scene, c.userData.label)  
              from.transform.position.copy(c.position)
              from.transform.rotation.copy(c.rotation)
              console.log(c.userData.label, c.rotation.y)
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
                  }                
                }                
              break;
            case "weapons":
                const weaponContent = Avern.Content.weapons.find(i => i.label === c.userData.label)
                const currentWeapons = get(Avern.Store.weapons)

                if (weaponContent) {
                  let shouldSpawnWeapon= true
                  if (currentWeapons.find(i => i.id===weaponContent.label)) shouldSpawnWeapon = false

                  if (shouldSpawnWeapon) {
                    const weaponOnMap = Avern.GameObjects.createGameObject(scene, c.name)
                    weaponOnMap.addComponent(WeaponOnMap, c, weaponContent)
                  }                
                }  
              break;

            case "doors":
              const gateContent = Avern.Content.gates.find(g => g.label === c.userData.label)
              if (c.userData.label === "rear-entrance" && currentWorldEvents.gateUnlocked) return
              const gateway = Avern.GameObjects.createGameObject(scene, c.name)
              gateway.addComponent(Gateway, c, gateContent)
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

    clearScene() {

    }

    async switchScene(toLabel){
      console.log(toLabel)
      gsap.to(".mask", { opacity: 0, duration: 2, delay: 2})
      gsap.to(".mask svg", { opacity: 0, duration: 2, delay: 1})
      gsap.to(".mask p", { opacity: 0, duration: 2, delay: 1 })
      Avern.GameObjects.removeAllGameObjects()

      // TEMP: clean up dom els (stupidly)
      document.querySelectorAll(".order-container, .numbers-container, .enemy-bar").forEach(el => el.remove())
      switch(toLabel) {
        case "courtyard-path": 
        case "courtyard-gate": 
        case "player-restart": 
          Avern.Content.baseFile=demoCourtyard
          break;
        case "cliffs-start": 
          // Avern.Content.baseFile=simple2
          // if (!get(Avern.Store.combatTutorialShown)) {
          //   setTimeout(() => {
          //     Avern.Store.combatTutorialVisible.set(true)
          //     Avern.Store.combatTutorialShown.set(true)
          //   }, 3000)
          // }
          // break;
        case "cliffs-end": 
          Avern.Content.baseFile=demoCliffs
          break;
        case "swamp-start": 
          Avern.Content.baseFile=demoSwamp
          break;
      }

      await this.initScene(toLabel)
      Avern.GameObjects.attachObservers() // Listen for signals from other gameObjects' components.

    }

    // add interaction to scene if condition has been met.
    addToScene(){}
}

export default Loader