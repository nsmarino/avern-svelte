import sanityClient from "../sanityClient"
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import npcGltf from "../../assets/npcs/plateau-npc.gltf"
import gearGltf from "../../assets/npcs/gear-interaction.gltf"
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { acceleratedRaycast } from 'three-mesh-bvh';
THREE.Mesh.prototype.raycast = acceleratedRaycast;

import Enemy from "../Components/Game/NonPlayer/Enemy";

import Interaction from "../Components/Game/NonPlayer/Interaction";

import Fountain from "../Components/Game/NonPlayer/Fountain";
import ItemOnMap from "../Components/Game/NonPlayer/ItemOnMap";
import Gateway from "../Components/Game/NonPlayer/Gateway";

import Collider from "../Components/World/Collider";
import Sky from "../Components/World/Sky";
import Lights from "../Components/World/Lights";

class Loader {
    constructor() {
        this.scene = null
        this.collider = null
    }

    async loadFromCMS(id=null) {
      const query = `*[_type == "settings"]{
        "mesh": mesh.asset->url,
      }`
      const response = await sanityClient.fetch(query)
      Avern.Content.baseFile = response[0].mesh

      Avern.Content.itemsOnMap = [
        {
          label: "key",
          item: {
            name: "Key to the Gatehouse",
            category: "key",
          }
        },
        {
          label: "healing-flask",
          item: {
            name: "Random Example Item",
            category: "flask"
          }
        }
      ]

      Avern.Content.testGate = {
        prompt: "Open",
        unlockedBy: "Key"
      }
      Avern.Content.interactions = [
        {
          label: "gatekeeper",
          prompt: "Talk",
          content: [
            {
                text: "Ahh...I have locked myself out of the gatehouse...",
                image: ""
            },
            {
                text: "Please traverse the mountain path and enter the gatehouse through the hatch on the roof.",
                image: ""
              },
            {
                text: "There you will find a key that will unlock the rear entrance.",
                image: ""
              }
          ],
          model: npcGltf
        },
        {
          label: "example",
          prompt: "Examine",
          content: [
            {
                text: "It is unclear what purpose this machine serves.",
                image: ""
            },
            {
                text: "Presumably the gatekeeper has a use for it. Its careful maintenance is a treasured part of his morning routine.",
                image: ""
              },
          ],
          model: gearGltf
        },
      ]
    }

    async initScene(id=null) {
      const scene = new THREE.Scene();
      scene.name = id ? id : "Start"
      Avern.State.scene = scene
      
      const sky = Avern.GameObjects.createGameObject(scene, "sky")
      sky.addComponent(Sky)

      const lights = Avern.GameObjects.createGameObject(scene, "lights")
      lights.addComponent(Lights)

      if (Avern.Content.baseFile) {
        const res = await new GLTFLoader().loadAsync(Avern.Content.baseFile)
        const gltfScene = res.scene;
        gltfScene.updateMatrixWorld( true );
        this.initNavmeshFromBaseFile(gltfScene,scene)
        const collider = Avern.GameObjects.createGameObject(scene, "collider")
        collider.addComponent(Collider, gltfScene)
  
        this.initNonPlayerFromBaseFile(gltfScene,scene)
      }

      if (Avern.Config.player.include) this.initPlayer(scene)
      if (Avern.Config.interface.include) this.initInterface(scene)
    }

    initNavmeshFromBaseFile(baseFile, scene) {
      const navmesh = baseFile.children.filter(child=> child.isMesh && child.userData.gltfExtensions.EXT_collections.collections[0]==="navmesh")[0]
      if (!navmesh) return;
      Avern.pathfindingZone = baseFile.name
      Avern.PATHFINDING.setZoneData(Avern.pathfindingZone, Pathfinding.createZone(navmesh.geometry));
      // visualize:
      // for (const vert of Avern.PATHFINDING.zones[baseFile.name].vertices) {
      //     const indicatorSize = 0.1
      //     const geometry = new THREE.BoxGeometry( indicatorSize,indicatorSize,indicatorSize); 
      //     const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
      //     const cube = new THREE.Mesh( geometry, material ); 
      //     cube.position.copy(vert)
      //     scene.add( cube );
      // }
      navmesh.visible = false
      scene.add(navmesh)
    }

    initNonPlayerFromBaseFile(baseFile, scene) {
      baseFile.traverse(c => {
        if (c.userData.gltfExtensions.EXT_collections.collections) {
          switch(c.userData.gltfExtensions.EXT_collections.collections[0]) {
            case "bow":
              const zombieBow = Avern.GameObjects.createGameObject(scene, c.name)                        
              zombieBow.addComponent(Enemy, c, "zombie-bow")
              break;

            case "sword":
              const zombieSword = Avern.GameObjects.createGameObject(scene, c.name)                        
              zombieSword.addComponent(Enemy, c, "zombie-sword")
              break;

            case "fountains":
              // const fountain = Avern.GameObjects.createGameObject(scene, c.name)                        
              // fountain.addComponent(Fountain, c)
              break;

            case "interactions":
              const interaction = Avern.GameObjects.createGameObject(scene, c.name)
              const interactionContent = Avern.Content.interactions.find(int => int.label === c.userData.label)
              interaction.addComponent(Interaction, c, interactionContent)
              break;

            case "items":
              const itemOnMap = Avern.GameObjects.createGameObject(scene, c.name)
              const itemContent = Avern.Content.itemsOnMap.find(i => i.label === c.userData.label)
              itemOnMap.addComponent(ItemOnMap, c, itemContent)
              break;

            case "doors":
              const gateway = Avern.GameObjects.createGameObject(scene, c.name)                        
              gateway.addComponent(Gateway, c, Avern.Content.testGate)
              break;

            default:
              break;
          }
        }
      });
    }

    initPlayer(scene) {
      const player = Avern.GameObjects.createGameObject(scene, "player")
      Avern.Player = player
      for (const component of Avern.Config.player.components) {
          player.addComponent(component)
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
      Avern.GameObjects.removeAllGameObjectsExceptPlayer()
    }
}

export default Loader