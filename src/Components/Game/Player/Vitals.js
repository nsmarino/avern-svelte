import * as THREE from 'three';
import GameplayComponent from '../../_Component';
import Enemy from '../NonPlayer/Enemy';
import Actions from './Actions';
import Body from './Body';

class Vitals extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        this.gameObject = gameObject
        this.hp = 100
        this.landmineVector = new THREE.Vector3()
    }

    onSignal(signalName, data) {
      switch(signalName) {
        case "casting_start":
          break;
        case "casting_progress":
          break;
        case "casting_interrupt":
          break;
        case "player_heal":
          if (Avern.State.flaskCount > 0) {
            (this.hp + 30 > 100) ? this.hp = 100 : this.hp += 30
            document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
            }
          break;
        case "monster_casting_finish":
          this.hp -= 20
          document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          if (this.hp <= 0) {
              this.emitSignal("player_death")
              this.hp = 100
              document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          }
          break;

        case "monster_attack":
          console.log("Receive monster attack")
          this.hp -= data.damage
          document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          if (this.hp <= 0) {
              this.emitSignal("player_death")
              Avern.Sound.thudHandler.currentTime = 0.02
              Avern.Sound.thudHandler.play()
  
              Avern.State.playerDead = true
              this.hp = 0
              document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          } else {
            this.emitSignal("player_receive_heavy_damage")
            Avern.Sound.thudHandler.currentTime = 0.02
            Avern.Sound.thudHandler.play()
          }
          break;
        case "landmine_detonated":
          this.landmineVector.copy(this.gameObject.transform.position)
          this.landmineVector.y -=3
          if (this.landmineVector.distanceTo(data.position) < data.radius) {
            this.hp -= data.damage
            document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
            if (this.hp <= 0) {
                this.emitSignal("player_death")
                Avern.State.playerDead = true
                this.hp = 0
                document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
            } else {
              this.emitSignal("player_receive_heavy_damage")
            }  
          }
          break;

        case "reset_stage":
            this.hp = 100
            document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
            Avern.State.playerDead = false
            break;
      }
    }

    attachObservers(parent) {
      this.addObserver(parent.getComponent(Body))
      this.addObserver(parent.getComponent(Actions))
      for (const enemy of Avern.State.Enemies) {
          this.addObserver(enemy.getComponent(Enemy))
      }
    }
}

export default Vitals