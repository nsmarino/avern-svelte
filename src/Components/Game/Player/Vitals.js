import * as THREE from 'three';
import gsap from "gsap"
import GameplayComponent from '../../_Component';
import Enemy from '../NonPlayer/Enemy';
import Body from './Body';

class Vitals extends GameplayComponent {
    constructor(gameObject, entity) {
        super(gameObject)
        this.gameObject = gameObject
        this.hp = 100
    }
    
    update(delta) {
      if (!Avern.State.worldUpdateLocked) {
        const inputs = Avern.Inputs.getInputs()
      }
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
          this.hp -= 20
          document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          if (this.hp <= 0) {
              this.emitSignal("player_death")
              Avern.State.playerDead = true
              this.hp = 0
              document.documentElement.style.setProperty("--player-vitality-width", `${this.hp}%`);
          } else {
            this.emitSignal("player_receive_heavy_damage")
          }
          break;
        case "landmine_detonated":
          const workerVector = new THREE.Vector3()
          workerVector.copy(this.gameObject.transform.position)
          workerVector.y -=3
          if (workerVector.distanceTo(data.position) < data.radius) {
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
      for (const enemy of Avern.State.Enemies) {
          this.addObserver(enemy.getComponent(Enemy))
      }
    }
}

export default Vitals