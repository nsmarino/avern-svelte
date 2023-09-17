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
        this.targetIndex = null
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

        const targetsArrayByOrder = targetsArray.map(i => {
            const targetOrder = targetsArray.indexOf(i)
            i[1] = {...i[1], order: targetOrder+1}
            return i
        })
        
        this.mapOfOrderedTargets = new Map(targetsArrayByOrder)

        this.losArray = Array.from(this.targetsMap)
            .sort((a, b) => a[1].losDistance - b[1].losDistance)

        if (this.targetIndex===null && this.losArray[0])this.emitSignal("closest_los", {id: this.losArray[0][0]})
        // const targetsArrayByLos = losArray.map(i => {
        //     const targetOrder = targetsArray.indexOf(i)
        //     i[1] = {...i[1], order: targetOrder+1}
        //     return i
        // })        
        // this.mapOfLosTargets = new Map(targetsArrayByLos)

        this.emitSignal("ordered_targets", { targets: this.mapOfOrderedTargets })

        const inputs = Avern.Inputs.getInputs()
        if (inputs.setTarget && !Avern.State.worldUpdateLocked) {
            this.setTargetFromInputKey(true)
        } else if (inputs.primaryClick && !Avern.State.worldUpdateLocked) {
            // this.setTargetFromClick(inputs.primaryClick)
        } else if (inputs.prevTarget && !Avern.State.worldUpdateLocked) {
            this.setTargetFromInputKey(false)

        } else if ((inputs.clearTarget && !Avern.State.worldUpdateLocked) || (inputs.turnWasPressed && !Avern.State.worldUpdateLocked)) {
            this.emitSignal("clear_target")
            this.targetIndex=null
        }

        // This needs to be refactored to be action-specific :)
        this.checkTarget()
    }

    setTargetFromInputKey(next) {
        console.log(this.targetsMap)
        // const increment = next ? 1 : -1
        const targetIds = Array.from(this.mapOfOrderedTargets.keys())
        if (this.targetIndex === null) {
            if (this.losArray[0]) this.emitSignal("set_target", { id: this.losArray[0][0] })
        } else {
            const indexToTarget = next ? targetIds[this.targetIndex] : targetIds[this.targetIndex-2]

            if (indexToTarget){
                this.emitSignal("set_target", {id: indexToTarget})
                // this.targetIndex += increment
            }        
        }
        // if(this.targetIndex === null && next) {
        //     this.targetIndex = 0
        // } else if (this.targetIndex === null && !next) {
        //     this.targetIndex = targetIds.length + 1
        // }
    }

    checkTarget(){
        if (!Avern.State.target) return;
        const targetPosition = Avern.State.target.transform.position

        this.targetingTriangle.set(this.triangleA.getWorldPosition(new THREE.Vector3()), this.triangleB.getWorldPosition(new THREE.Vector3()), this.triangleC.getWorldPosition(new THREE.Vector3()))

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
                    this.targetsMap.set(data.id, {proximity: data.proximity, y:data.y, order: null, losDistance: data.losDistance})
                } else {
                    this.targetsMap.delete(data.id)
                }
                break;
            case "clear_target":
                this.targetIndex= null
                if (data.visible) {
                    this.targetsMap.set(data.id, {proximity: data.proximity, y:data.y, order: null})
                } else {
                    this.targetsMap.delete(data.id)
                }
                if (data.dead) {
                    this.losArray = Array.from(this.targetsMap)
                        .sort((a, b) => a[1].losDistance - b[1].losDistance)
                    this.targetIndex = null
                    this.setTargetFromInputKey(true)
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

// next steps:
// 1. can init target from right side as well
// 2. first target should be the one closest to the player vision line, not target_1 (indicate by coloring the order tag)
// 3. auto-target enemy closest to player vision line when currently targeted enemy dies