import * as THREE from 'three';
import gsap from "gsap"
import GameplayComponent from '../../_Component';
import InteractionOverlay from '../../Interface/InteractionOverlay';
import Inventory from '../Player/Inventory';
import Targeting from '../Player/Targeting';
import Body from '../Player/Body';
import Notices from '../../Interface/Notices';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/obelisk.gltf'

class ItemOnMap extends GameplayComponent {
    constructor(gameObject, spawnPoint, content) {
        super(gameObject)
        this.gameObject=gameObject
        this.prompt = "Pick up item"

        this.content = content
        gameObject.transform.position.copy(spawnPoint.position)
        this.particleGeometry = new THREE.BufferGeometry();
        this.particleGeometryTwo = new THREE.BufferGeometry()
        this.particleCount = 2000

        // Create an array of particle positions
        var particlePositions = new Float32Array(this.particleCount * 3);

        // Loop through and set the initial x, y, and z coordinates for each particle
        for (var i = 0; i < 100; i++) {
            var x = 0;
            var y = 0;
            var z = 0;
            particlePositions[i * 3 + 0] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
        }
        // Create an array of particle positions
        var particlePositionsTwo = new Float32Array(this.particleCount * 3);

        // Loop through and set the initial x, y, and z coordinates for each particle
        for (var i = 0; i < 100; i++) {
            var x = 0;
            var y = 0;
            var z = 0;
            particlePositionsTwo[i * 3 + 0] = x;
            particlePositionsTwo[i * 3 + 1] = y;
            particlePositionsTwo[i * 3 + 2] = z;
        }
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.particleGeometryTwo.setAttribute('position', new THREE.BufferAttribute(particlePositionsTwo, 3));

        // Create a material for the particles
        var particleMaterial = new THREE.PointsMaterial({
            color: 0x0096FF,
            transparent:true,
            size: 0.11
        });
        var particleMaterialTwo = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            transparent:true,
            size: 0.11
        });

        // Create a particle system from the buffer geometry and material
        this.particleSystem = new THREE.Points(this.particleGeometry, particleMaterial);
        this.particleSystemTwo = new THREE.Points(this.particleGeometryTwo, particleMaterialTwo);
        gameObject.transform.add(this.particleSystem)
        gameObject.transform.add(this.particleSystemTwo)

        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(gltf)
            this.gltf.scene.name = gameObject.name

            this.colliderCapsule = generateCapsuleCollider(
                this.gltf.scene.getObjectByName("capsule-bottom"),
                this.gltf.scene.getObjectByName("capsule-top"),
                this.gltf.scene.getObjectByName("capsule-radius")
            )
            gameObject.transform.add(this.colliderCapsule.body)
            this.colliderCapsule.ring.visible=true
            gameObject.transform.add(this.colliderCapsule.ring)
            this.colliderCapsule.body.onPlayerLook = this.onPlayerLook.bind(this)
            this.colliderCapsule.body.onPlayerAction = this.onPlayerAction.bind(this)
            this.gltf.scene.traverse(child => {
                child.visible = false
            })
            gameObject.transform.add(this.gltf.scene)
        }
        initFromGLTF()
    }

    update(deltaTime) {
        this.animateParticleSystem(this.particleGeometry)
        this.animateParticleSystem(this.particleGeometryTwo)
        if (Avern.Player && this.colliderCapsule) {
            const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, this.colliderCapsule)
            if (collision.isColliding) {
                this.emitSignal("capsule_collide", {collision, capsule: this.colliderCapsule})
            }
            this.emitSignal("has_collider", {collider: this.colliderCapsule, offsetY: 2})
        }
    }

    animateParticleSystem(geometry){
        // Get the particle positions from the buffer geometry
        var positions = geometry.attributes.position.array;

        // Loop through each particle
        for (var i = 0; i < this.particleCount; i++) {

            // Assign a random speed to the particle
            var speed = Math.random() * 0.01;

            // X translate:
            positions[i * 3 + 0] += (Math.random() - 0.5) * 0.015;
            // Y translate:
            positions[i * 3 + 1] += speed;
            // Z translate:
            positions[i * 3 + 2] += (Math.random() - 0.5) * 0.015;

            // reset if it has moved a certain distance on Y axis
            const resetCondition = positions[i * 3 + 1] > (Math.random() * 50)

            if (resetCondition) {
                // Reset the particle back to its starting position
                positions[i * 3 + 0] = 0;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;
            }
        }

        // Update the particle positions in the buffer geometry
        geometry.attributes.position.needsUpdate = true;        
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "example_signal":
            console.log("Example signal", data)
            break;
        }
    }

    onPlayerLook() {
        Avern.Store.prompt.set(this.prompt)
    }

    onPlayerAction() {
        Avern.Sound.itemHandler.currentTime=0
        Avern.Sound.itemHandler.play()
        this.emitSignal("item_pickup", { item: this.content.item })
        this.emitSignal("clear_target", {visible: false, dead: true, id: this.gameObject.name})
        this.emitSignal("show_notice", { notice: `Picked up ${this.content.item.name}`, color: "yellow", delay: 5000})
       
        if (this.content.label==="rear-entrance") {Avern.Store.worldEvents.update(events => {
            const updatedEvents = {
                ...events,
                keyRetrieved: true

            }
            return updatedEvents
        })}
        this.gameObject.removeFromScene()
        this.gameObject.sleep = true
    }
    
    attachObservers(parent) {
        this.addObserver(Avern.Player.getComponent(Inventory))
        this.addObserver(Avern.Player.getComponent(Targeting))
        this.addObserver(Avern.Interface.getComponent(InteractionOverlay))
        this.addObserver(Avern.Interface.getComponent(Notices))
        for (const component of parent.components) {
            if (!(component instanceof ItemOnMap)) {
              this.addObserver(component)
            }
        }
    }
}

export default ItemOnMap
  