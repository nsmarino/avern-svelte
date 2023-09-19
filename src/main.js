import "./scss/main.scss"
import gsap from "gsap"
import Engine from "./Engine"

window.Avern = Engine

import stagingBase from "../assets/staging-1.gltf"

import App from './App.svelte'

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

	const showIntro = () => {
		gsap.set(".menu-options", { display: "none"})
		gsap.set(".intro", { display: 'block'})
		gsap.to(".intro", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	}
	const showCredits = () => {
		gsap.set(".menu-options", { display: "none"})
		gsap.set(".credits", { display: 'block'})
		gsap.to(".credits", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	}
	const hideCredits = () => {
		gsap.set(".credits", { display: "none"})
		gsap.set(".menu-options", { display: 'block'})
		gsap.to(".menu-options", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	}
	const showMenu = () => {
		gsap.set(".intro-prompt", { display: "none"})
		gsap.set(".menu-options", { display: 'block'})
		gsap.to(".menu-options", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
		document.removeEventListener("click", showMenu)
	}
	document.addEventListener("click", showMenu)

	document.querySelector(".new-game").addEventListener("click", showIntro)
	document.querySelector(".show-credits").addEventListener("click", showCredits)
	document.querySelector(".hide-credits").addEventListener("click", hideCredits)

	document.querySelector(".start-btn").addEventListener("click", () => {
		init(false)	
		clearChildren()
	})
	if(!localStorage.getItem("AvernStore")) {
		document.querySelector(".load-game").remove()
	} else {
		document.querySelector(".load-game").addEventListener("click", () => {
			init(true)	
			clearChildren()
		})
	}


}

async function init(useSavedGame) {
	await Avern.Loader.loadFromCMS(useSavedGame) // get content asynchronously.
	Avern.Content.baseFile = stagingBase
	await Avern.Loader.initScene()
	new App({
		target: document.getElementById('app'),
	})
	Avern.GameObjects.attachObservers() // Listen for signals from other gameObjects' components.
	render()
}

function render() {
	if(Avern.renderPaused)return
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

// export default app
