import * as THREE from 'three';

class Core {
    constructor() {
        this.clock = new THREE.Clock();

        // Set antialias to false and change pixel ratio to ~0.5 for nintendo64 feel
        this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.querySelector(".canvas") } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        window.addEventListener( 'resize', function () {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }.bind(this), false );

    }
}

export default Core