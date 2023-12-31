// OST:
import intro from '../../assets/audio/intro.mp3'
import courtyard from "../../assets/audio/ost/courtyard.mp3"
import swamp from "../../assets/audio/ost/cliffs.mp3"
import cliffs from '../../assets/audio/ost/hub.mp3'

// SOUND FX:
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
import eat from '../../assets/audio/eat.mp3'
import alert from '../../assets/audio/alert.wav'
import alert2 from '../../assets/audio/alert2.mp3'
import enemyDie from '../../assets/audio/enemy-die.wav'
import projectile from '../../assets/audio/projectile.wav'
 
class Sound {
    constructor() {

        this.ost = {
            intro,
            courtyard,
            cliffs,
            swamp,
        }
        this.introHandler = document.createElement("audio")
        this.introHandler.src = this.ost.intro
        this.introHandler.loop = true
        this.introHandler.volume = 0.1

        this.musicHandler = document.createElement("audio")
        this.musicHandler.src = this.ost.courtyard
        this.musicHandler.loop = true
        this.musicHandler.volume = 0.05
        // this.playSceneMusic("courtyard")

        
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

        this.alertHandler = document.createElement("audio") // button fx for main menu
        this.alertHandler.id = "alert-fx"
        this.alertHandler.src = alert
        this.alertHandler.volume = 0.1

        this.alert2Handler = document.createElement("audio") // button fx for main menu
        this.alert2Handler.id = "alert2-fx"
        this.alert2Handler.src = alert2
        this.alert2Handler.volume = 0.1

        this.projectileHandler = document.createElement("audio") // button fx for main menu
        this.projectileHandler.id = "projectile-fx"
        this.projectileHandler.src = projectile
        this.projectileHandler.volume = 0.1

        this.enemyDieHandler = document.createElement("audio") // button fx for main menu
        this.enemyDieHandler.id = "enemy-die-fx"
        this.enemyDieHandler.src = enemyDie
        this.enemyDieHandler.volume = 0.03

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

        this.eatHandler = document.createElement("audio") // button fx for main menu
        this.eatHandler.id = "eat-fx"
        this.eatHandler.src = eat
        this.eatHandler.volume = 0.1

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

    }

    init() {
        console.log("Does this init run lol")
    }

    playSceneMusic(scene,volume) {
        this.musicHandler.src = this.ost[scene]
        this.musicHandler.currentTime = 0
        this.musicHandler.volume = volume

        this.musicHandler.play()   
    }

}

export default Sound