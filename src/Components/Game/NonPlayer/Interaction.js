import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GameplayComponent from '../../_Component';

class Interaction extends GameplayComponent {
    constructor(gameObject, spawnPoint, interactions) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)
        this.gameObject.transform.rotation.copy(spawnPoint.rotation)

        // Interaction content:
        this.interactions=interactions
        this.interactionsIndex = interactions.index

        this.prompt = this.interactions.content[this.interactionsIndex].prompt
        this.content = this.interactions.content[this.interactionsIndex].nodes
        this.contentIndex = 0

        console.log("Content", this.content)
        // In world:
        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(this.interactions.model)
            this.gltf.scene.name = gameObject.name
            gameObject.transform.add(this.gltf.scene)
            this.gltf.scene.traverse(c => {
                c.castShadow = true
            })

            // Capsule collision
            this.capsuleBottom = this.gltf.scene.getObjectByName("capsule-bottom")
            this.capsuleTop = this.gltf.scene.getObjectByName("capsule-top")
            this.capsuleBottom.visible = false
            this.capsuleTop.visible = false
            let bbox = new THREE.Box3().setFromObject(this.capsuleBottom);
            let bsphere = bbox.getBoundingSphere(new THREE.Sphere());
            const color = new THREE.Color( 0x008800 );
            this.wireframe = new THREE.Mesh(
                new THREE.CapsuleGeometry( bsphere.radius, 1.8, 4, 8 ),
                new THREE.MeshStandardMaterial( { color: color } )
            )
            this.wireframe.material.wireframe = true
            this.wireframe.visible = false
            this.wireframe.position.y += (this.capsuleTop.position.y / 2)
            gameObject.transform.add(this.wireframe)

            const torusGeometry = new THREE.TorusGeometry( bsphere.radius, 0.025, 12, 40 ); 
            const torusMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
            torusMaterial.transparent = true
            torusMaterial.opacity = 0.6
            this.ring = new THREE.Mesh( torusGeometry, torusMaterial );
            this.ring.rotation.x = Math.PI / 2
            this.ring.position.y+=0.2
            this.gameObject.transform.add( this.ring );
      
            const startVector = new THREE.Vector3().copy(gameObject.transform.position)
            const endVector = new THREE.Vector3().copy(gameObject.transform.position)
            this.capsuleHeight = startVector.distanceTo(endVector)
            endVector.y += this.capsuleHeight
            const line = new THREE.Line3(startVector, endVector)
            this.capsule = {
                radius: bsphere.radius,
                segment: line,
                body: this.wireframe,
                position: spawnPoint.position,
                velocity: new THREE.Vector3()
            }
            this.wireframe.onPlayerLook = this.onPlayerLook.bind(this)
            this.wireframe.onPlayerAction = this.onPlayerAction.bind(this)

            // Anims
            this.mixer = new THREE.AnimationMixer( this.gltf.scene );

            const clips = this.gltf.animations

            this.idle = this.mixer.clipAction(
                THREE.AnimationClip.findByName(clips, "SIT")
            )

            this.action = this.idle
            if (this.action) this.fadeIntoAction(this.action,0)

        }
        initFromGLTF()
    }
    fadeIntoAction(newAction=this.idle, duration=0.2) {
        if (this.current_action) {
            this.current_action.fadeOut(duration);
        }
        this.action = newAction
        this.action.reset();
        this.action.fadeIn(duration);
        this.action.play();
        this.current_action = this.action;
    }

    update(delta) {
        if (this.mixer && Avern.State.worldUpdateLocked == false) this.mixer.update(delta);
    }

    onPlayerLook() {
        console.log("Player look")
        Avern.Store.prompt.set(this.prompt)
    }

    onPlayerAction() {
        Avern.Sound.pageHandler.currentTime = 0
        Avern.Sound.pageHandler.play()

        if (this.content[this.contentIndex]) {
            if (this.contentIndex === 0) {
                Avern.Store.prompt.set("")
                Avern.State.worldUpdateLocked = true
            }
            Avern.Store.interaction.set({active: true, node: this.content[this.contentIndex]})
            if (this.content[this.contentIndex].trigger) {
                console.log("TRIGGER! Update worldEvents in store, emit signal?")
            }
            if (this.content[this.contentIndex].item) {
                console.log("ITEM !!!! Update inventory in store, emit signal?")
            }

            this.contentIndex += 1
        } else {
            this.clearInteraction()
        }
    }

    clearInteraction() {
        Avern.State.worldUpdateLocked = false
        Avern.Store.interaction.set({active: false, node: {}})
        this.contentIndex = 0

        // Set up next interaction. This could check world events
        if (this.interactions.content[this.interactionsIndex+1]) {
            this.content= this.interactions.content[this.interactionsIndex+1].nodes
            this.prompt= this.interactions.content[this.interactionsIndex+1].prompt
            this.interactionsIndex+1
        }
        Avern.Store.prompt.set(this.prompt)
    }


    attachObservers(parent) {
        // this.addObserver(Avern.Interface.getComponent(InteractionOverlay))
    }
}

export default Interaction