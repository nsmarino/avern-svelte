import * as THREE from 'three';
import { OrbitControls } from "../../../helpers/OrbitControls"
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
        this.playerCameraPlaceholder.position.set(0,1.5,-18)
        this.gameObject.transform.add(this.playerCameraTarget)

        // console.log(OrbitControls)
        // this.controls = new OrbitControls( this.camera, document.querySelector("canvas") );

        window.addEventListener( 'resize', function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }.bind(this), false );
    }

    update() {
        // this.controls.target = Avern.Player.transform.position
        // set rotation with inputs
        const inputs = Avern.Inputs.getInputs()
        if (!this.targeting) {

            if (inputs.cameraUp && this.playerCameraTarget.rotation.x < 0.9) {
                this.playerCameraTarget.rotateX(0.02)
            } else if (inputs.cameraDown && this.playerCameraTarget.rotation.x > -0.4) {
                this.playerCameraTarget.rotateX(-0.02)
            }

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
            // console.log("Targeted object,", data.object.transform.position)
            if (!this.targeting) return
            data.object.transform.getWorldPosition(this.targetVector)
            this.targetVector.y+=1
            this.playerCameraPlaceholder.getWorldPosition(this.cameraPosVector)
            this.cameraTarget.position.lerp(this.targetVector, this.targetLerp)
            this.camera.position.lerp(this.cameraPosVector, this.cameraLerp)
            this.camera.lookAt(this.cameraTarget.position)    
            break;

          case "active_target":
            console.log("Received active target")
            this.targeting=true
            this.playerCameraTarget.rotation.set(0,0,0)

            break;
          case "clear_target":
            this.targeting=false
            break;
        }
    }
    
    isCameraViewBlocked(targetPosition, cameraPosition, collider) {

        const towardsCamera = cameraPosition.clone().sub(targetPosition);
        const raycaster = new THREE.Raycaster(targetPosition, towardsCamera.normalize());

        const intersects = raycaster.intersectObject(collider, true);

        if (intersects.length === 0) {
            return false; // No obstacles, camera view is not blocked
        }

        if (intersects[0].point.distanceTo(targetPosition) < cameraPosition.distanceTo(targetPosition)) return intersects[0].point;

        return false; // Camera view is partially blocked
    }
}

export default FollowCamera