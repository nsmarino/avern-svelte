import * as THREE from 'three';

import GameplayComponent from '../../_Component';
import ActionBar from '../../Interface/ActionBar';
import Enemy from '../NonPlayer/Enemy';
    
class Targeting extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject
        this.clickRaycast = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.actionRange = 40
        
        this.targetingTriangle = new THREE.Triangle()

        this.frontDirection = new THREE.Vector3(0, 0, -1); // Negative Z direction for front
        this.leftDirection = new THREE.Vector3(-1, 0, 0); // Negative X direction for left
        this.rightDirection = new THREE.Vector3(1, 0, 0); // Positive X direction for right

        this.tempLeft = new THREE.Vector3()
        this.tempRight = new THREE.Vector3()
        this.tempFront = new THREE.Vector3()

        this.rangeWidth = 16
        this.tempLeft.copy(this.leftDirection).multiplyScalar(this.rangeWidth)
        this.tempRight.copy(this.rightDirection).multiplyScalar(this.rangeWidth)
        this.tempFront.copy(this.frontDirection).multiplyScalar(-this.actionRange)

        this.triangleA = new THREE.Object3D()
        this.triangleA.position.copy(this.gameObject.transform.position)
        this.gameObject.transform.add(this.triangleA)

        this.triangleB = new THREE.Object3D()
        this.triangleB.position.copy(this.gameObject.transform.position).add(this.tempLeft).add(this.tempFront);
        this.gameObject.transform.add(this.triangleB)

        this.triangleC = new THREE.Object3D()
        this.triangleC.position.copy(this.gameObject.transform.position).add(this.tempRight).add(this.tempFront);
        this.gameObject.transform.add(this.triangleC)

        // this.mesh = new THREE.Mesh(
        //     new THREE.SphereGeometry(),
        //     new THREE.MeshBasicMaterial()
        // );
        // this.gameObject.transform.parent.add(this.mesh)

        // this.mesh2 = new THREE.Mesh(
        //     new THREE.SphereGeometry(),
        //     new THREE.MeshBasicMaterial()
        // );
        // this.gameObject.transform.parent.add(this.mesh2)

        // this.mesh3 = new THREE.Mesh(
        //     new THREE.SphereGeometry(),
        //     new THREE.MeshBasicMaterial()
        // );
        // this.gameObject.transform.parent.add(this.mesh3)

        this.targetInRange = false

    }

    update() {
        const inputs = Avern.Inputs.getInputs()
        if (inputs.setTarget && !Avern.State.worldUpdateLocked) {
            this.setTargetFromInputKey()
        } else if (inputs.primaryClick && !Avern.State.worldUpdateLocked) {
            this.setTargetFromClick(inputs.primaryClick)
        }
        this.checkTarget()
    }

    checkTarget(){
        if (!Avern.State.target) return;
        const targetPosition = Avern.State.target.transform.position

        this.targetingTriangle.set(this.triangleA.getWorldPosition(new THREE.Vector3()), this.triangleB.getWorldPosition(new THREE.Vector3()), this.triangleC.getWorldPosition(new THREE.Vector3()))

        // Just for visualizing:
        // this.triangleA.getWorldPosition(this.mesh.position)
        // this.triangleB.getWorldPosition(this.mesh2.position)
        // this.triangleC.getWorldPosition(this.mesh3.position)

        // Handle target being in range:
        if(this.targetingTriangle.containsPoint(targetPosition)){
            if (!this.targetInRange) {
                this.targetInRange = true
                Avern.State.target.getComponent(Enemy).onSignal("entered_range")
            }
        } else if (this.targetInRange) {
            this.targetInRange = false
            Avern.State.target.getComponent(Enemy).onSignal("exited_range")
        }
    }
    
    setTargetFromClick(e) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        this.clickRaycast.setFromCamera( this.pointer, Avern.State.camera );
        const intersects = this.clickRaycast.intersectObjects( Avern.State.scene.children );
        if (intersects.length === 0 && Avern.State.target || Avern.State.target && intersects[0] && intersects[0].object && !intersects[0].object.parent.canBeTargeted) {
            this.clearTarget()
        } else if (intersects[0] && intersects[0].object.parent.canBeTargeted) {
            const enemyToTarget = Avern.State.Enemies.find(enem => enem.name === intersects[0].object.parent.name)
            if (Avern.State.target) {
                Avern.State.target.getComponent(Enemy).onSignal("clear_target")
            }
            Avern.State.target = enemyToTarget
            Avern.State.target.getComponent(Enemy).onSignal("set_target")
        }
    }

    // Needs optimization:
    setTargetFromInputKey(){
        if (Avern.State.target) {
            Avern.State.target.getComponent(Enemy).onSignal("clear_target")
        }
        const frustum = new THREE.Frustum()
        const matrix = new THREE.Matrix4().multiplyMatrices(Avern.State.camera.projectionMatrix, Avern.State.camera.matrixWorldInverse)
        frustum.setFromProjectionMatrix(matrix)


        // Get array of visible enemies
        for (const enemy of Avern.State.Enemies) {
            if(frustum.intersectsObject(enemy.getComponent(Enemy).colliderCapsule.body)) {
                if (!Avern.State.visibleEnemies.find(enem => enem.name === enemy.name)) Avern.State.visibleEnemies.push(enemy)
            } else {
                Avern.State.visibleEnemies = Avern.State.visibleEnemies.filter(enem => enem.name != enemy.name)
            }
        }

        Avern.State.target = null

        if (Avern.State.visibleEnemies.length === 0){ 
            // handle?
        } else {
            if ((Avern.State.visibleEnemies.length === 1 && Avern.State.targetIndex >= 1 )|| Avern.State.targetIndex >= Avern.State.visibleEnemies.length) Avern.State.targetIndex = 0 // TRYING TO FIX A BUG THAT I CANT CONSISTENTLY RE-CREATE.
            Avern.State.target = Avern.State.visibleEnemies[Avern.State.targetIndex]
            if (Avern.State.target) {
                Avern.State.target.getComponent(Enemy).onSignal("set_target")
                Avern.State.targetIndex = Avern.State.targetIndex === Avern.State.visibleEnemies.length - 1 ? 0 : Avern.State.targetIndex+=1;
            }
        }
    }
    
    clearTarget() {
        if (Avern.State.target) {
            Avern.State.target.getComponent(Enemy).onSignal("clear_target")
            Avern.State.target = null
        }
    }

    attachObservers(parent) {
        this.addObserver(Avern.Interface.getComponent(ActionBar))
        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
    }
}

export default Targeting



// via chatgpt:
function sortByProximityToLeft(points, camera, renderer) {
    const sortedPoints = points.slice().sort((a, b) => {
        // Convert 3D points to 2D screen coordinates
        const screenPosA = a.clone().project(camera);
        const screenPosB = b.clone().project(camera);

        // Map screen coordinates to actual screen pixel positions
        const screenWidth = renderer.domElement.width;
        const screenHeight = renderer.domElement.height;
        const pixelPosXA = (screenPosA.x + 1) * (screenWidth / 2);
        const pixelPosXB = (screenPosB.x + 1) * (screenWidth / 2);

        // Compare the X positions to sort by proximity to the left side
        return pixelPosXA - pixelPosXB;
    });

    return sortedPoints;
}

// use:
// Assume you have an array of Three.js points, a camera, and a renderer
// const points = [
//     new THREE.Vector3(1, 0, 0),
//     new THREE.Vector3(0, 1, 0),
//     new THREE.Vector3(0, 0, 1)
// ];

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();

// // Call the sorting function
// const sortedPoints = sortByProximityToLeft(points, camera, renderer);

