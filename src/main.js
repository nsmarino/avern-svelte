import styles from "./scss/main.scss"
import gsap from "gsap"
import Engine from "./Engine"

window.Avern = Engine

import stagingBase from "../assets/wts-base.gltf"

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

function startMenu() {
	const rootStart = document.querySelector(".start-menu-root")

	const clearChildren = () => {
		const duration = 0.1
		gsap.to(rootStart, {autoAlpha:"0", pointerEvents: "none", duration})
		gsap.to(document.querySelector(".start-menu"), {autoAlpha:"0", pointerEvents: "none", duration: 0,})
		gsap.set(".mask", { opacity: 1})
		gsap.set(".mask svg", { opacity: 1})
		gsap.set(".mask p", { opacity: 1})
		gsap.to(".mask", { opacity: 0, delay: 2, duration: 3 })
		gsap.to(".mask svg", { opacity: 0, delay: 2, duration: 0.2 })
		gsap.to(".mask p", { opacity: 0, delay: 2, duration: 0.2 })

	}

	document.querySelector(".start-btn").addEventListener("click", () => {

	
		init()	
		clearChildren()

	})
}

async function init() {
	await Avern.Loader.loadFromCMS() // get content asynchronously.
	Avern.Content.baseFile = stagingBase
	await Avern.Loader.initScene() // load layers (1) World (2) Interface (3) Game
	console.log("After initscene")
	Avern.GameObjects.attachObservers() // Listen for signals from other gameObjects' components.
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

startMenu()

export default app
