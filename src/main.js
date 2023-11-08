import "./scss/main.scss"
import gsap from "gsap"
import Engine from "./Engine"

window.Avern = Engine

import App from './App.svelte'

function start() {
	document.querySelector(".start-menu").addEventListener("click", () => {
		document.querySelector(".start-menu").style.display = "none"
		init(false)
	})
}

async function init(useSavedGame) {
	await Avern.Loader.loadContent(useSavedGame) // get content asynchronously.
	await Avern.Loader.initScene()
	new App({
		target: document.getElementById('app'),
	})
	Avern.GameObjects.attachObservers() // Listen for signals from other gameObjects' components.
	Avern.Inputs.inputs.interact=false

	render()
}

function render() {
	requestAnimationFrame( render );
	const delta = Math.min( Avern.Core.clock.getDelta(), 0.1 );

	Avern.GameObjects.update(delta)
	Avern.Inputs.update()

	Avern.Core.renderer.render( 
		Avern.State.scene,
		Avern.State.camera
	);
}

start()