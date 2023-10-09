import "./scss/main.scss"
import gsap from "gsap"
import Engine from "./Engine"

window.Avern = Engine

import App from './App.svelte'

let introInterval = null

function startMenu() {
	const rootStart = document.querySelector(".start-menu-root")

	let introIndex = 0
	const introContent = [
		{
			text: "<p>The Merchant's Road has long connected the empire's capital to the riches of the far east.</p>",
			image: "image"
		},
		{
			text: "<p>Each day caravans trudge through marsh and mountain, bearing loads of precious metals, pungent spices and fine textiles.</p><p>The road is long and dangerous. Here and there the caravans seek refuge in heavily fortified settlements, knots of safety in this cord of commerce.</p>",
		},
		{
			text: "<p>One such settlement is the fortress of Koker, high in the jagged mountains on the eastern frontier of the empire.</p><p>You have lived here all your life.</p>",
			image: "image"
		},
		{
			text: "<p>You do not remember the earthquake that devastated your village, and you do not remember the merchants who found you amidst the wreckage.</p>",
			image: "image"
		},
		{
			text: "<p>You do not remember the clink of gold when they sold you into this fortress's service.</p><p>You do not remember the bite of the blade that forever marked the degree of your servitude.</p><p>You will live for the fortress, and you will have no life beyond it.</p>",
			image: "image"
		},
		{
			text: "<p>You wear a wooden mask, as all the empire's castrates do, and you carry a bolt action rifle.</p><p>There are goats on the cliffs above the fortress, and you are their guardian.</p>",
			image: "image"
		},
	]
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

	const showInitialConfig = () => {
		gsap.set(".menu-options", { display: "none"})
		gsap.set(".fse-bg", { display: 'none'})
		gsap.set(".initial-config", { display: 'block'})
		gsap.to(".initial-config", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	}

	const showIntro = (dominantHand) => {
		Avern.Sound.introHandler.play()

		window.avernKeyboardConfig = dominantHand
		gsap.set(".initial-config", { display: "none"})
		gsap.set(".intro", { display: 'block'})
		gsap.to(".intro", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
		// gsap.set(".intro-placeholder-illus", { display: 'flex'})
		// gsap.to(".intro-placeholder-illus", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
		Avern.Inputs.setConfig(dominantHand)
		document.querySelector(".intro .next-card-key").innerText = dominantHand === "left" ? "H" : "G"
		document.querySelector(".intro-text-container").innerHTML += `<div class="nextCard">${introContent[introIndex].text}</div>`
		// document.addEventListener("keydown", handleIntroKeyDown)
		introInterval = setInterval(() => {
			progressIntro()
		}, 11000);
	}
	const progressIntro = () => {
		// if ((e.code==="KeyH" && window.avernKeyboardConfig==="left") || (e.code==="KeyG" && window.avernKeyboardConfig==="right")) {
			introIndex++
			if (introContent[introIndex]) {
				document.querySelectorAll(".nextCard").forEach(el=>el.classList.remove("nextCard"))
				document.querySelector(".intro-text-container").innerHTML += `<div class="nextCard">${introContent[introIndex].text}</div>`
			} else {
				showTitleCard()
			}
		// }
	}

	function showTitleCard(){
		clearInterval(introInterval)
		// document.removeEventListener("keydown", handleIntroKeyDown)
		document.querySelector(".intro").remove()
		gsap.set(".title-card", { display: 'flex'})
		gsap.to(".title-card", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
		setTimeout(()=> {
			document.querySelector(".start-key-indicator").innerText = window.avernKeyboardConfig === "left" ? "H" : "G"
			gsap.to(".start-key-indicator", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
			document.addEventListener("keydown", handleTitleKeyDown)
		}, 4000)
	}

	function handleTitleKeyDown(e) {
		if ((e.code==="KeyH" && window.avernKeyboardConfig==="left") || (e.code==="KeyG" && window.avernKeyboardConfig==="right")) {
			document.removeEventListener("keydown", handleTitleKeyDown)
			Avern.Sound.introHandler.pause()
            Avern.Sound.musicHandler.play()
			init(false)	
			clearChildren()
		}
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
	// const showMenu = () => {
	// 	gsap.set(".intro-prompt", { display: "none"})
	// 	gsap.set(".menu-options", { display: 'block'})
	// 	gsap.to(".menu-options", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	// 	gsap.set(".fse-bg", { display: 'block'})
	// 	gsap.to(".fse-bg", { opacity: 1, duration: 1, y: 0, pointerEvents: "auto"  })
	// 	document.removeEventListener("click", showMenu)
	// }
	// document.addEventListener("click", showMenu)

	document.querySelector(".new-game").addEventListener("click", showInitialConfig)
	document.querySelector(".config-left").addEventListener("click", () => showIntro("left"))
	document.querySelector(".config-right").addEventListener("click", () => showIntro("right"))
	// document.querySelector(".show-credits").addEventListener("click", showCredits)
	// document.querySelector(".hide-credits").addEventListener("click", hideCredits)

	// document.querySelector(".start-btn").addEventListener("click", () => {
	// 	document.removeEventListener("keydown", handleIntroKeyDown)
	// 	init(false)	
	// 	clearChildren()
	// })
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
	await Avern.Loader.initScene()
	new App({
		target: document.getElementById('app'),
	})
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

// export default app
