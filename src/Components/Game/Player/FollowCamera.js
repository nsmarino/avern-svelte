import * as THREE from 'three';
import gsap from "gsap"
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GameplayComponent from '../../_Component';

class FollowCamera extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.gameObject = gameObject
        this.camera = new THREE.PerspectiveCamera(
            50, window.innerWidth / window.innerHeight
        )

        this.orbitCam = new THREE.PerspectiveCamera(
            50, window.innerWidth / window.innerHeight
        )        
        Avern.State.scene.add(this.orbitCam)

        this.cameraTarget = new THREE.Object3D()
        this.camVector = new THREE.Vector3()

        this.gameObject.transform.add(this.cameraTarget)
        this.cameraTarget.position.y += 1
        this.cameraTarget.add(this.camera)
        this.camera.position.set(0, 1, -9)
        this.camera.lookAt(this.cameraTarget.position)
        window.addEventListener( 'resize', function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.orbitCam.aspect = window.innerWidth / window.innerHeight;
            this.orbitCam.updateProjectionMatrix();
        }.bind(this), false );
        Avern.State.camera = this.camera

        this.orbitCam.position.copy(this.camera.position)
        this.orbitCam.lookAt(this.cameraTarget.position)
        
        this.orbitCamControls = new OrbitControls( this.orbitCam, document.body )
        this.orbitCamControls.maxDistance = 15.1
        this.orbitCamControls.minDistance = 3
        this.orbitCamControls.target = this.cameraTarget.position
        this.orbitCamControls.update()

        this.originalCameraPosition = this.camera.position.clone();
        this.lerpingSpeed = 0.1

        this.workerVector = new THREE.Vector3()
        this.arrow = null
    }

    // Check function to determine if the camera's view is blocked
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

    pointAlongLine(origin, target, distance) {
        const direction = new THREE.Vector3().subVectors(target, origin).normalize();
        const point = new THREE.Vector3().copy(origin).addScaledVector(direction, distance);
        return point;
    }

    lerpCamera(target, camera, collider, renderer) {
        const targetPosition = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        target.getWorldPosition(targetPosition);
        camera.getWorldPosition(cameraPosition);

        const obstaclePoint = this.isCameraViewBlocked(targetPosition, cameraPosition, collider);
    
        if (obstaclePoint) {
            const distanceThreshold = 0.1
            const distanceFromObstaclePointToTarget = obstaclePoint.distanceTo(targetPosition);
            const distanceFromCameraToTarget = cameraPosition.distanceTo(targetPosition);
            const distanceFromCameraToObstaclePoint = cameraPosition.distanceTo(obstaclePoint);
            Avern.State.scene.attach( camera ); // detach from parent and add to scene
            if (distanceFromCameraToObstaclePoint > distanceThreshold && distanceFromCameraToTarget > distanceFromObstaclePointToTarget) camera.position.lerp(obstaclePoint, this.lerpingSpeed)
            this.cameraTarget.attach( camera ); // reattach to original parent

        } else {
            camera.position.lerp(this.originalCameraPosition, this.lerpingSpeed);
        }
    }

    update() {

        this.lerpCamera(Avern.Player.transform, this.camera, Avern.State.collider)

        const inputs = Avern.Inputs.getInputs()
        this.orbitCamControls.target = Avern.Player.transform.position


        if (inputs.freeCam) {
            this.camera.getWorldPosition(this.orbitCam.position)
            this.orbitCam.lookAt(this.cameraTarget.position)
            Avern.State.camera = this.orbitCam
            Avern.State.camera.updateProjectionMatrix()
            gsap.set(document.body, {cursor: "var(--camera-cursor)"})

        }

        if (inputs.freeCamWasLifted) {
            Avern.State.camera = this.camera
            gsap.set(document.body, {cursor: "var(--pointer-cursor)"})
        }
        this.orbitCamControls.update()
    }

    onSignal(signalName, data={}) {

        switch(signalName) {
          case "example_signal":
            console.log("Example signal", data)
            break;
        }
    }
    
    attachObservers(parent) {

    }
}

export default FollowCamera

// chatGPT fn:
// Define variables for camera lerping
// const originalCameraPosition = camera.position.clone();
// const lerpingSpeed = 0.05; // Adjust this value for the lerping speed

// // Check function to determine if the camera's view is blocked
// function isCameraViewBlocked(target, camera, obstacles, renderer) {
//     const targetPosition = new THREE.Vector3();
//     target.getWorldPosition(targetPosition);

//     const cameraDirection = targetPosition.clone().sub(camera.position);
//     const raycaster = new THREE.Raycaster(camera.position, cameraDirection.normalize());

//     const intersects = raycaster.intersectObjects(obstacles, true);

//     if (intersects.length === 0) {
//         return false; // No obstacles, camera view is not blocked
//     }

//     // Check if any obstacle intersects the entire viewport
//     const viewport = renderer.getSize(new THREE.Vector2());
//     const fullViewportArea = viewport.width * viewport.height;

//     for (const intersect of intersects) {
//         const obstacleSize = intersect.object.geometry.boundingBox.getSize(new THREE.Vector3());
//         const obstacleArea = obstacleSize.x * obstacleSize.y;

//         if (obstacleArea >= fullViewportArea) {
//             return true; // Camera view is blocked by a large enough obstacle
//         }
//     }

//     return false; // Camera view is partially blocked
// }

// // Translation function to lerping the camera
// function lerpCamera(target, camera, obstacles, renderer) {
//     const isBlocked = isCameraViewBlocked(target, camera, obstacles, renderer);

//     if (isBlocked) {
//         const targetPosition = new THREE.Vector3();
//         target.getWorldPosition(targetPosition);

//         const newPosition = targetPosition.clone().add(camera.position.clone().sub(targetPosition).normalize());
//         camera.position.lerp(newPosition, lerpingSpeed);
//     } else {
//         camera.position.lerp(originalCameraPosition, lerpingSpeed);
//     }
// }

// // Inside your render loop
// function animate() {
//     // Call the lerpCamera function with appropriate arguments
//     lerpCamera(targetObject, camera, arrayOfObstacles, renderer);

//     // Other rendering and animation code
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
// }

// // Start the animation
// animate();
