import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GameplayComponent from '../../_Component';

class FollowCamera extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject

        this.targeting = false
        this.targetVector = new THREE.Vector3()
        this.cameraPosVector = new THREE.Vector3()
        
        this.camera = new THREE.PerspectiveCamera(
            30, window.innerWidth / window.innerHeight
        )
        this.cameraTarget = new THREE.Object3D()
        const geometry = new THREE.SphereGeometry( 0.25, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        material.wireframe = true
        const sphere = new THREE.Mesh( geometry, material )

        // this.cameraTarget.add(sphere)
        Avern.State.scene.add(this.camera)
        Avern.State.scene.add(this.cameraTarget)
        Avern.State.camera = this.camera
        this.camera.lookAt(this.cameraTarget.position)
        this.targetLerp = 0.3
        this.cameraLerp = 0.3

        // When not targeting an enemy, use these positions:
        this.playerCameraTarget = new THREE.Object3D()
        this.playerCameraTarget.position.y += 1
        this.playerCameraPlaceholder = new THREE.Object3D()
        this.playerCameraTarget.add(this.playerCameraPlaceholder)
        this.playerCameraPlaceholder.position.set(0,2,-15)
        this.gameObject.transform.add(this.playerCameraTarget)

        // this.orbitCam = new THREE.PerspectiveCamera(
        //     50, window.innerWidth / window.innerHeight
        // )        
        // Avern.State.scene.add(this.orbitCam)


        // this.gameObject.transform.add(this.cameraTarget)
        // this.cameraTarget.position.y += 1
        // this.cameraTarget.add(this.camera)
        // this.camera.position.set(0, 1, -9)
        // this.camera.lookAt(this.cameraTarget.position)
        window.addEventListener( 'resize', function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            // this.orbitCam.aspect = window.innerWidth / window.innerHeight;
            // this.orbitCam.updateProjectionMatrix();
        }.bind(this), false );

        // this.orbitCam.position.copy(this.camera.position)
        // this.orbitCam.lookAt(this.cameraTarget.position)
        
        // this.orbitCamControls = new OrbitControls( this.orbitCam, document.querySelector(".canvas") )
        // this.orbitCamControls.maxDistance = 15.1
        // this.orbitCamControls.minDistance = 3
        // this.orbitCamControls.target = this.cameraTarget.position
        // this.orbitCamControls.update()

        // this.originalCameraPosition = this.camera.position.clone();

        // this.workerVector = new THREE.Vector3()
        // this.arrow = null
    }

    // lerpCamera(target, camera, collider) {
        // const targetPosition = new THREE.Vector3();
        // const cameraPosition = new THREE.Vector3();
        // target.getWorldPosition(targetPosition);
        // camera.getWorldPosition(cameraPosition);

        // const obstaclePoint = this.isCameraViewBlocked(targetPosition, cameraPosition, collider);
    
        // if (obstaclePoint) {
        //     const distanceThreshold = 0.1
        //     const distanceFromObstaclePointToTarget = obstaclePoint.distanceTo(targetPosition);
        //     const distanceFromCameraToTarget = cameraPosition.distanceTo(targetPosition);
        //     const distanceFromCameraToObstaclePoint = cameraPosition.distanceTo(obstaclePoint);
        //     Avern.State.scene.attach( camera ); // detach from parent and add to scene
        //     if (distanceFromCameraToObstaclePoint > distanceThreshold && distanceFromCameraToTarget > distanceFromObstaclePointToTarget) camera.position.lerp(obstaclePoint, this.lerpingSpeed)
        //     this.cameraTarget.attach( camera ); // reattach to original parent

        // } else {
        //     camera.position.lerp(this.originalCameraPosition, this.lerpingSpeed);
        // }
    // }

    setLockOn() {
        // set cameraTarget as child of enemy gameobject
    }
    clearLockOn() {
        // set cameraTarget back to child of player gameobject
    }

    update() {
        if (!this.targeting) {
            this.playerCameraTarget.getWorldPosition(this.cameraTarget.position)
            // this.playerCameraPlaceholder.getWorldPosition(this.camera.position)
            this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
            this.camera.position.copy(this.cameraPosVector)

            this.camera.lookAt(this.cameraTarget.position)    
        }
        // this.camera.lookAt(this.cameraTarget.position)
        // this.lerpCamera(this.cameraTarget, this.camera, Avern.State.collider)

        // const inputs = Avern.Inputs.getInputs()
        // this.orbitCamControls.target = Avern.Player.transform.position

        // if (inputs.freeCam) {
        //     this.camera.getWorldPosition(this.orbitCam.position)
        //     this.orbitCam.lookAt(this.cameraTarget.position)
        //     Avern.State.camera = this.orbitCam
        //     Avern.State.camera.updateProjectionMatrix()
        //     gsap.set(document.body, {cursor: "var(--camera-cursor)"})

        // }

        // if (inputs.freeCamWasLifted) {
        //     Avern.State.camera = this.camera
        //     gsap.set(document.body, {cursor: "var(--pointer-cursor)"})
        // }
        // this.orbitCamControls.update()
    }

    onSignal(signalName, data={}) {

        switch(signalName) {
          case "targeted_object":
            if (!this.targeting) return
            data.object.transform.getWorldPosition(this.targetVector)
            this.targetVector.y+=1
            this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
            const distanceThreshold = 0.15
            const distanceFromCurrentCameraTargetToUpdatedCameraTarget = this.cameraTarget.position.distanceTo(this.targetVector);
            if (distanceFromCurrentCameraTargetToUpdatedCameraTarget > distanceThreshold) {
                this.cameraTarget.position.lerp(this.targetVector, this.targetLerp)
                this.camera.position.lerp(this.cameraPosVector, this.cameraLerp)
            } else {
                this.cameraTarget.position.copy(this.targetVector)
                this.camera.position.copy(this.cameraPosVector)
            }
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

// on "lock_on" signal from targeting component: initLockOn
// on "clear_lock_on" signal from targeting component: clearLockOn