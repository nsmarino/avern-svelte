import * as THREE from 'three';
import GameplayComponent from '../_Component';
import {RGBELoader} from "three/addons/loaders/RGBELoader.js"
import hdrUrl from "../../../assets/environment/industrial_sunset.hdr"

class Lights extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        // White directional light at half intensity shining from the top.
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.directionalLight.position.set(2,2,-1);
        gameObject.transform.parent.add( this.directionalLight );
        this.directionalLight.castShadow = true
        //Set up shadow properties for the light
        this.directionalLight.shadow.mapSize.width = 1024; // default
        this.directionalLight.shadow.mapSize.height = 1024; // default
        this.directionalLight.shadow.camera.near = 0.5; // default
        this.directionalLight.shadow.camera.far = 500; // default

        this.targetObject = new THREE.Object3D(); 
        Avern.State.scene.add(this.targetObject);

        this.directionalLight.target = this.targetObject;
        //Create a helper for the shadow camera (optional)
        // const shadowhelper = new THREE.CameraHelper( this.directionalLight.shadow.camera );
        // Avern.State.scene.add( shadowhelper );
        // const helper = new THREE.DirectionalLightHelper(this.directionalLight);
        // gameObject.transform.parent.add( helper );

        this.loader = new RGBELoader()
        this.loader.load(hdrUrl, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            gameObject.transform.parent.environment = texture;
            gameObject.transform.parent.background = texture;
        })
    }

    update(deltaTime) {
        this.directionalLight.position.copy(Avern.Player.transform.position);
        this.directionalLight.position.x += 2
        this.directionalLight.position.y += 2
        this.directionalLight.position.z += 2
        this.targetObject.position.copy(Avern.Player.transform.position)

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

export default Lights