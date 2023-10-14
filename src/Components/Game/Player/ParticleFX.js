import * as THREE from 'three';
import GameplayComponent from '../../_Component';

class ParticleFX extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject
        this.status = false

        this.particleGeometry = new THREE.BufferGeometry();
        this.particleCount = 500
        this.movementSpeed = 2

        // Create an array of particle positions
        var particlePositions = new Float32Array(this.particleCount * 3);
        this.dirs = []

        // Loop through and set the initial x, y, and z coordinates for each particle
        for (var i = 0; i < 100; i++) {
            var x = 0;
            var y = 0;
            var z = 0;
            particlePositions[i * 3 + 0] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
            this.dirs[i * 3 + 0] = (Math.random() * this.movementSpeed)-(this.movementSpeed/2)
            this.dirs[i * 3 + 1] = (Math.random() * this.movementSpeed)-(this.movementSpeed/2)
            this.dirs[i * 3 + 2] = (Math.random() * this.movementSpeed)-(this.movementSpeed/2)
        }

        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Create a material for the particles
        this.particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: .6,
            transparent: true,
            opacity: .6,
            visible: false
        });


        // Create a particle system from the buffer geometry and material
        this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
        gameObject.transform.add(this.particleSystem)

    }

    update() {
        if (this.status) this.animateParticleSystem(this.particleGeometry)
    }

    animateParticleSystem(geometry){
        // Get the particle positions from the buffer geometry
        var positions = geometry.attributes.position.array;

        // Loop through each particle
        for (var i = 0; i < this.particleCount; i++) {

            // X translate:
            positions[i * 3 + 0] += this.dirs[i * 3 + 0]
            // Y translate:
            positions[i * 3 + 1] += this.dirs[i * 3 + 1]
            // Z translate:
            positions[i * 3 + 2] += this.dirs[i * 3 + 2]
        }

        // Update the particle positions in the buffer geometry
        geometry.attributes.position.needsUpdate = true;        
    }

    activate(position){
        Avern.State.scene.attach( this.particleSystem ); // detach from parent and add to scene
        this.particleSystem.position.copy( position );
        this.status = true
        this.particleSystem.material.visible = true
    }

    deactivate(){
        this.status = false
        this.particleSystem.material.visible = false

        var positions = this.particleGeometry.attributes.position.array;
        for (var i = 0; i < this.particleCount; i++) {
            positions[i * 3 + 0] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }  
        // this.gameObject.transform.attach(this.particleSystem)  
    }


    onSignal(signalName, data={}) {

        switch(signalName) {
          case "particle_fx":
            console.log("Incoming data.color", data.color)
            this.particleMaterial.color.setHex(data.color)
            this.activate(data.position)

            setTimeout(() => {
                this.deactivate()
            }, data.duration)

            break;
        }
    }
    
    attachObservers(parent) {

    }
}

export default ParticleFX