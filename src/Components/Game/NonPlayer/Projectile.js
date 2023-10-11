import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateCapsuleCollider, checkCapsuleCollision } from '../../../helpers';
import gltf from '../../../../assets/environment/gateway.gltf'
import {get} from 'svelte/store'
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Body from '../Player/Body';
import Vitals from '../Player/Vitals';


// Manage bubble-bullets from enemies

class Projectile extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        this.gameObject = gameObject
    
        this.projectiles = []

        this.projectileGeometry = new THREE.SphereGeometry(0.2)
        this.projectileMaterial = new THREE.MeshBasicMaterial({color:0x00ff00})

        this.workerA = new THREE.Vector3()
        this.workerB = new THREE.Vector3()

    }

    update(delta) {            

        for (const projectile of this.projectiles) {
            // apply velocity 
            projectile.velocity = projectile.destination.clone().sub( projectile.position );
            projectile.velocity.normalize();
            projectile.position.add(projectile.velocity.clone().multiplyScalar( delta * projectile.speed ))
            projectile.capsuleBottom.position.add(projectile.velocity.clone().multiplyScalar( delta * projectile.speed ))
            projectile.capsuleTop.position.add(projectile.velocity.clone().multiplyScalar( delta * projectile.speed ))
            projectile.destination.add(projectile.velocity.clone().multiplyScalar( delta * projectile.speed ))

            // update mesh
            projectile.mesh.position.copy(projectile.position)

            // update collider
            projectile.capsuleBottom.getWorldPosition(this.workerA)
            projectile.capsuleTop.getWorldPosition(this.workerB)
            projectile.collider.segment.start.copy(this.workerA)
            projectile.collider.segment.end.copy(this.workerB)
            
            // check for collider collision with player
            if (Avern.Player) {
                const collision = checkCapsuleCollision({ segment: Avern.Player.getComponent(Body).tempSegment, radius: Avern.Player.getComponent(Body).radius}, projectile.collider)
                if (collision.isColliding) {
                  this.emitSignal("monster_attack", { damage: 30,})
                  // immediately remove
                  Avern.State.scene.remove(projectile.mesh)
                  this.projectiles = this.projectiles.filter(pro => pro != projectile)
                } else if (projectile.position.distanceTo(projectile.initialPosition) > 20) {
                    Avern.State.scene.remove(projectile.mesh)
                    this.projectiles = this.projectiles.filter(pro => pro != projectile)
                }              
            } 
        }

    }

    onSignal(signalName,{ destination, radius, speed }) {
        let projectile;


        switch(signalName) {
          case "launch_projectile":
            const initialPosition = new THREE.Vector3( 
                this.gameObject.transform.position.x, 
                this.gameObject.transform.position.y+1, 
                this.gameObject.transform.position.z
            )

            const capsuleBottom = new THREE.Object3D()
            capsuleBottom.position.copy(initialPosition)
            capsuleBottom.position.y-radius
            const capsuleTop = new THREE.Object3D()
            capsuleTop.position.copy(initialPosition)
            capsuleTop.position.y+radius

            const capsuleRadius = new THREE.Object3D()
            capsuleRadius.position.copy(initialPosition)
            capsuleBottom.position.x+radius

            // add raycast so it can delete on collision with environment
            projectile = {
                position: initialPosition,
                initialPosition: initialPosition.clone(),
                capsuleTop,
                capsuleBottom,
                capsuleRadius,
                destination,
                speed,
                velocity: null,
                mesh: new THREE.Mesh(
                    this.projectileGeometry,
                    this.projectileMaterial
                ),
                collider: generateCapsuleCollider( 
                    capsuleBottom,capsuleTop,capsuleRadius 
                )
            }
            Avern.State.scene.add(projectile.mesh)
            projectile.mesh.position.copy(initialPosition)
            this.projectiles.push(projectile)
            break;
        }
    }
    
    attachObservers(parent) {
        this.addObserver(Avern.Player.getComponent(Vitals))
    }
}

export default Projectile
