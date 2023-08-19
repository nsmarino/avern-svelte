import * as THREE from 'three';
import gsap from "gsap"

import GameplayComponent from '../../_Component';
import Enemy from '../NonPlayer/Enemy';
import Vitals from './Vitals';
import Body from './Body';

class Landmine extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)

        this.radius = 4
        this.damage = 40
        const icoMat = new THREE.MeshBasicMaterial( { color: 0xD20000 } );
        this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(this.radius,3), icoMat);
        this.mesh.material.wireframe = true

        const icoMat2 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
        this.mesh2 = new THREE.Mesh(new THREE.IcosahedronGeometry(this.radius,2), icoMat2);
        this.mesh2.material.wireframe = true
    }

    update() {
        this.mesh.rotation.y+=0.01
        this.mesh2.rotation.y-=0.01
    }

    onSignal(signalName, data={}) {
        switch(signalName) {
          case "set_landmine":
            // place landmine at location provided
            this.mesh.position.copy(data.position)
            this.mesh.position.y -= this.radius
            Avern.State.scene.add(this.mesh)
            this.mesh2.position.copy(data.position)
            this.mesh2.position.y -= this.radius
            Avern.State.scene.add(this.mesh2)
            break;
          case "detonate_landmine":
            // send signal out with landmine location for enemies to react to
            Avern.State.scene.remove(this.mesh)
            Avern.State.scene.remove(this.mesh2)
            this.emitSignal("landmine_detonated", { position: this.mesh.position, radius: this.radius, damage: this.damage })
            break;
        }
    }
    
    attachObservers(parent) {
        this.addObserver(parent.getComponent(Vitals))
        this.addObserver(parent.getComponent(Body))

        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
    }
}

export default Landmine