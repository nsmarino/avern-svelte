import exploration from '../../assets/audio/bg.mp3'
import testRun from '../../assets/audio/Dirt_Jogging.mp3'
import gunshot from '../../assets/audio/pistol.mp3'
import shotgun from '../../assets/audio/pistol.mp3'
import landmine from '../../assets/audio/pistol.mp3'
import thud from '../../assets/audio/thud.mp3'
import loadingsound from '../../assets/audio/reload-sound.mp3'

class Sound {
    constructor() {
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
        this.thudHandler.volume = 0.1

        document.addEventListener("click", () => {
            this.musicHandler.play()
        })
    }

    init() {

    }
}

export default Sound