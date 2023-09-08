import * as THREE from 'three';

import GameplayComponent from '../../_Component';
import Enemy from '../NonPlayer/Enemy';
import Body from "./Body"
import FollowCamera from "./FollowCamera"
import Actions from "./Actions"
    
class Targeting extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject

        this.targetsMap = new Map()
        this.targetIndex = 0
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
        const targetsArray = Array.from(this.targetsMap)
            .sort((a, b) => a[1].proximity - b[1].proximity)

        const targetsArrayWithOrder = targetsArray.map(i => {
            const targetOrder = targetsArray.indexOf(i)
            i[1] = {...i[1], order: targetOrder+1}
            return i
        })
        
        this.mapOfOrderedTargets = new Map(targetsArrayWithOrder)

        this.emitSignal("ordered_targets", { targets: this.mapOfOrderedTargets })


        const inputs = Avern.Inputs.getInputs()
        if (inputs.setTarget && !Avern.State.worldUpdateLocked) {
            this.setTargetFromInputKey(true)
        } else if (inputs.primaryClick && !Avern.State.worldUpdateLocked) {
            // this.setTargetFromClick(inputs.primaryClick)
        } else if (inputs.prevTarget && !Avern.State.worldUpdateLocked) {
            console.log("Prev target")
            this.setTargetFromInputKey(false)

        } else if (inputs.clearTarget && !Avern.State.worldUpdateLocked) {
            this.emitSignal("clear_target")
            this.targetIndex=0
        }

        // This needs to be refactored to be action-specific :)
        this.checkTarget()
    }

    setTargetFromInputKey(next) {
        const increment = next ? 1 : -1
        // console.log("Current target index", this.targetIndex, "increment", increment, "ordered targets", this.mapOfOrderedTargets)
        const targetIds = Array.from(this.mapOfOrderedTargets.keys())
        // console.log(targetIds)
        // console.log(this.targetIndex+increment)
        const indexToTarget = next ? targetIds[this.targetIndex] : targetIds[this.targetIndex-2]
        console.log("Find index", this.targetIndex-2, "in", targetIds)
        console.log("Target this:", indexToTarget)
        if (indexToTarget){
            console.log("EMITTING SIGNAL", this.targetIndex-2, indexToTarget)
            this.emitSignal("set_target", {id: indexToTarget})
            this.targetIndex += increment
        }
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

    // setTargetFromClick(e) {
    //     this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    //     this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //     this.clickRaycast.setFromCamera( this.pointer, Avern.State.camera );
    //     const intersects = this.clickRaycast.intersectObjects( Avern.State.scene.children );
    //     if (intersects.length === 0 && Avern.State.target || Avern.State.target && intersects[0] && intersects[0].object && !intersects[0].object.parent.canBeTargeted) {
    //         this.clearTarget()
    //     } else if (intersects[0] && intersects[0].object.parent.canBeTargeted) {
    //         const enemyToTarget = Avern.State.Enemies.find(enem => enem.name === intersects[0].object.parent.name)
    //         if (Avern.State.target) {
    //             Avern.State.target.getComponent(Enemy).onSignal("clear_target")
    //         }
    //         Avern.State.target = enemyToTarget
    //         Avern.State.target.getComponent(Enemy).onSignal("set_target")
    //     }
    // }
    
    clearTarget() {
        if (Avern.State.target) {
            Avern.State.target.getComponent(Enemy).onSignal("clear_target")
            Avern.State.target = null
        }
    }
    onSignal(signalName, data={}) {
        switch(signalName) {
            case "target_visible":
                if (data.visible) {
                    this.targetsMap.set(data.id, {proximity: data.proximity, y:data.y, order: null})
                } else {
                    this.targetsMap.delete(data.id)
                }
                break;
            case "clear_target":
                this.targetIndex= 0
                if (data.visible) {
                    this.targetsMap.set(data.id, {proximity: data.proximity, y:data.y, order: null})
                } else {
                    this.targetsMap.delete(data.id)
                }
                break;
            case "targeted_object":
                const indexOfCurrentTarget = this.mapOfOrderedTargets.get(data.object.name)?.order
                if (indexOfCurrentTarget) this.targetIndex = indexOfCurrentTarget
                break;
        }
    }

    attachObservers(parent) {
        for (const enemy of Avern.State.Enemies) {
            this.addObserver(enemy.getComponent(Enemy))
        }
        this.addObserver(parent.getComponent(Body))
        this.addObserver(parent.getComponent(FollowCamera))
        this.addObserver(parent.getComponent(Actions))
    }
}

export default Targeting