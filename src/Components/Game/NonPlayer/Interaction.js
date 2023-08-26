import * as THREE from 'three';

import gltf from '../../../../assets/npcs/plateau-npc.gltf'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GameplayComponent from '../../_Component';
import InteractionOverlay from '../../Interface/InteractionOverlay';

class Interaction extends GameplayComponent {
    constructor(gameObject, spawnPoint, src) {
        super(gameObject)
        this.gameObject = gameObject
        this.gameObject.transform.position.copy(spawnPoint.position)
        this.gameObject.transform.rotation.copy(spawnPoint.rotation)

        // Interaction content:
        this.prompt = src.prompt
        this.content = src.content

        this.contentIndex = 0

        // In world:
        const initFromGLTF = async () => {
            this.gltf = await new GLTFLoader().loadAsync(src.model)
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
        this.emitSignal("player_look", { prompt: this.prompt })
    }

    onPlayerAction() {
        if (this.contentIndex === 0) {
            this.emitSignal("player_interaction", { text: this.content[this.contentIndex].text, first: true })
            this.contentIndex += 1
        } else if (this.content[this.contentIndex] && this.contentIndex > 0) {
            this.emitSignal("player_interaction", { text: this.content[this.contentIndex].text, first: false })
            this.contentIndex += 1
        } else {
            this.emitSignal("end_interaction")
            this.contentIndex = 0
        }
    }

    attachObservers(parent) {
        this.addObserver(Avern.Interface.getComponent(InteractionOverlay))
    }
}

export default Interaction