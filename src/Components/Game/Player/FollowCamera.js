import * as THREE from 'three';

import GameplayComponent from '../../_Component';

class FollowCamera extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject

        this.targeting = false
        this.targetVector = new THREE.Vector3()
        this.cameraPosVector = new THREE.Vector3()
        this.comparisonVector = new THREE.Vector3()
        this.comparisonVector2 = new THREE.Vector3()
        
        this.camera = new THREE.PerspectiveCamera(
            30, window.innerWidth / window.innerHeight
        )
        this.cameraTarget = new THREE.Object3D()
        const geometry = new THREE.SphereGeometry( 0.25, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        material.wireframe = true
        this.sphere = new THREE.Mesh( geometry, material )

        // this.cameraTarget.add(this.sphere)
        Avern.State.scene.add(this.camera)
        Avern.State.scene.add(this.cameraTarget)
        Avern.State.camera = this.camera
        this.camera.lookAt(this.cameraTarget.position)
        this.targetLerp = 0.1
        this.cameraLerp = 0.1

        // When not targeting an enemy, use these positions:
        this.playerCameraTarget = new THREE.Object3D()
        this.playerCameraTarget.position.y += 1
        this.playerCameraPlaceholder = new THREE.Object3D()
        this.playerCameraTarget.add(this.playerCameraPlaceholder)
        this.playerCameraPlaceholder.position.set(0,2,-15)
        this.gameObject.transform.add(this.playerCameraTarget)

        window.addEventListener( 'resize', function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }.bind(this), false );

    }

    update() {
        if (!this.targeting) {
            if ((this.playerCameraTarget.getWorldPosition(this.comparisonVector).distanceTo(this.cameraTarget.getWorldPosition(this.comparisonVector2)) > 0.2 )) {
                this.playerCameraTarget.getWorldPosition(this.targetVector)
                this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
                this.camera.position.lerp(this.cameraPosVector, 0.3)
                this.cameraTarget.position.lerp(this.targetVector, 0.3)
                this.camera.lookAt(this.cameraTarget.position)
            } else {
                this.playerCameraTarget.getWorldPosition(this.cameraTarget.position)
                this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
                this.camera.position.copy(this.cameraPosVector)
                this.camera.lookAt(this.cameraTarget.position)   
            }     
        }
    }

    onSignal(signalName, data={}) {

        switch(signalName) {
          case "targeted_object":
            if (!this.targeting) return
            data.object.transform.getWorldPosition(this.targetVector)
            this.targetVector.y+=1
            this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
            const distanceThreshold = 0.1
            const distanceFromCurrentCameraTargetToUpdatedCameraTarget = this.cameraTarget.position.distanceTo(this.targetVector);
            // if (distanceFromCurrentCameraTargetToUpdatedCameraTarget > distanceThreshold) {
                this.cameraTarget.position.lerp(this.targetVector, this.targetLerp)
                this.camera.position.lerp(this.cameraPosVector, this.cameraLerp)
            // } else {
            //     this.cameraTarget.position.copy(this.targetVector)
            //     this.camera.position.copy(this.cameraPosVector)
            // }
            this.camera.lookAt(this.cameraTarget.position)    

            // data.object.transform.getWorldPosition(this.cameraTarget.position)

            break;
          case "active_target":
            this.targeting=true

            break;
          case "clear_target":
            this.targeting=false
            break;
        }
    }
    
    // attachObservers(parent) {

    // }
    isCameraViewBlocked(targetPosition, cameraPosition, collider) {

        const towardsCamera = cameraPosition.clone().sub(targetPosition);
        const raycaster = new THREE.Raycaster(targetPosition, towardsCamera.normalize());

        // Avern.State.scene.remove ( this.arrow );
        // this.arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, 0.5 * 0xffffff );
        // Avern.State.scene.add( this.arrow );

        const intersects = raycaster.intersectObject(collider, true);

        if (intersects.length === 0) {
            return false; // No obstacles, camera view is not blocked
        }

        if (intersects[0].point.distanceTo(targetPosition) < cameraPosition.distanceTo(targetPosition)) return intersects[0].point;

        return false; // Camera view is partially blocked
    }

    // pointAlongLine(origin, target, distance) {
    //     const direction = new THREE.Vector3().subVectors(target, origin).normalize();
    //     const point = new THREE.Vector3().copy(origin).addScaledVector(direction, distance);
    //     return point;
    // }
}

export default FollowCamera