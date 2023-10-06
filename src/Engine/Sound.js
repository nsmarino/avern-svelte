import intro from '../../assets/audio/intro.mp3'
import exploration from '../../assets/audio/fse--paths.mp3'
import testRun from '../../assets/audio/Dirt_Jogging.mp3'
import gunshot from '../../assets/audio/pistol.mp3'
import shotgun from '../../assets/audio/pistol.mp3'
import landmine from '../../assets/audio/pistol.mp3'
import thud from '../../assets/audio/thud.mp3'
import ready from '../../assets/audio/fse--prepared.mp3'
import loadingsound from '../../assets/audio/reload-sound.mp3'
import targeting from '../../assets/audio/fse--targeting.mp3'
import drink from '../../assets/audio/drink.mp3'
import bayonet from '../../assets/audio/bayonet.wav'
import pickup from '../../assets/audio/pickup.wav'
import page from '../../assets/audio/page-flip.mp3'
 
class Sound {
    constructor() {
        this.introHandler = document.createElement("audio")
        this.introHandler.src = intro
        this.introHandler.loop = true
        this.introHandler.volume = 0.1

        this.musicHandler = document.createElement("audio")
        this.musicHandler.src = exploration
        this.musicHandler.loop = true
        this.musicHandler.volume = 0.1
        
        this.fxHandler = document.createElement("audio")
        this.fxHandler.id = "fx"
        this.fxHandler.src = testRun
        this.fxHandler.loop = true
        this.fxHandler.volume = 0.1


        this.reloadHandler = document.createElement("audio") // button fx for main menu
        this.reloadHandler.id = "gun-load-fx"
        this.reloadHandler.src = loadingsound
        this.reloadHandler.volume = 0.1

        this.gunshotHandler = document.createElement("audio") // button fx for main menu
        this.gunshotHandler.id = "gunshot-fx"
        this.gunshotHandler.src = gunshot
        this.gunshotHandler.volume = 0.1

        this.shotgunHandler = document.createElement("audio") // button fx for main menu
        this.shotgunHandler.id = "shotgun-fx"
        this.shotgunHandler.src = shotgun
        this.shotgunHandler.volume = 0.1

        this.landmineHandler = document.createElement("audio") // button fx for main menu
        this.landmineHandler.id = "landmine-fx"
        this.landmineHandler.src = landmine
        this.landmineHandler.volume = 0.1

        this.thudHandler = document.createElement("audio") // button fx for main menu
        this.thudHandler.id = "thud-fx"
        this.thudHandler.src = thud
        this.thudHandler.volume = 0.03

        this.readyHandler = document.createElement("audio") // button fx for main menu
        this.readyHandler.id = "ready-fx"
        this.readyHandler.src = ready
        this.readyHandler.volume = 0.1

        this.targetHandler = document.createElement("audio") // button fx for main menu
        this.targetHandler.id = "target-fx"
        this.targetHandler.src = targeting
        this.targetHandler.volume = 0.1

        this.drinkHandler = document.createElement("audio") // button fx for main menu
        this.drinkHandler.id = "drink-fx"
        this.drinkHandler.src = drink
        this.drinkHandler.volume = 0.1

        this.bayonetHandler = document.createElement("audio") // button fx for main menu
        this.bayonetHandler.id = "bayonet-fx"
        this.bayonetHandler.src = bayonet
        this.bayonetHandler.volume = 0.1

        this.itemHandler = document.createElement("audio") // button fx for main menu
        this.itemHandler.id = "item-fx"
        this.itemHandler.src = pickup
        this.itemHandler.volume = 0.1


        this.pageHandler = document.createElement("audio") // button fx for main menu
        this.pageHandler.id = "page-fx"
        this.pageHandler.src = page
        this.pageHandler.volume = 0.2

        // document.addEventListener("click", () => {
        //     if (this.introHandler.classList.contains("active")) return
        //     this.introHandler.classList.add("active")
        //     this.introHandler.play()
        // })
        // document.querySelector(".start-btn").addEventListener("click", () => {
            // this.introHandler.pause()
            // this.musicHandler.play()
        // })
        document.querySelector(".load-game").addEventListener("click", () => {
            this.introHandler.pause()
            this.musicHandler.play()
        })
    }

    init() {

    }
}

export default Sound