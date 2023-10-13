import * as THREE from 'three';
import GameplayComponent from '../../_Component';
import Enemy from '../NonPlayer/Enemy';
import Actions from './Actions';
import Body from './Body';
import {get} from 'svelte/store'

class Vitals extends GameplayComponent {
    constructor(gameObject) {
        super(gameObject)
        this.gameObject = gameObject
    }

    update(delta) {
      if (get(Avern.Store.player).energy <= get(Avern.Store.player).maxEnergy) {
        Avern.Store.player.update(player => {
          const updatedPlayer = {
            ...player,
            energy: player.energy+0.033
          }
          return updatedPlayer
        })
      }
    }
    onSignal(signalName, data) {
      switch(signalName) {
        case "casting_start":
          break;
        case "spend_energy":
          console.log("Cost:", data.cost)
            Avern.Store.player.update(player => {
              console.log(player)
              const updatedPlayer = {
                ...player,
                energy: player.energy - data.cost <= 0 ? 0 : player.energy - data.cost
              }
              console.log(updatedPlayer.energy)
              return updatedPlayer
            })
          break;
        case "casting_progress":
          break;
        case "casting_interrupt":
          break;
        case "player_heal":
          if (get(Avern.Store.player).flasks > 0) {
            if (get(Avern.Store.player).hp + 30 > get(Avern.Store.player).maxHp) {
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  flasks: player.flasks - 1,
                  hp: player.maxHp
                }
                return updatedPlayer
              })
            } else {
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  flasks: player.flasks - 1,
                  hp: player.hp + 30
                }

                return updatedPlayer
              })
            }
          }
          break;
        case "eat_fruit":
          if (get(Avern.Store.player).fruit > 0) {
            if (get(Avern.Store.player).energy + 50 > get(Avern.Store.player).maxEnergy) {
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  fruit: player.fruit - 1,
                  energy: player.maxEnergy
                }
                return updatedPlayer
              })
            } else {
              Avern.Store.player.update(player => {
                const updatedPlayer = {
                  ...player,
                  fruit: player.fruit - 1,
                  energy: player.energy + 50
                }

                return updatedPlayer
              })
            }
          }
          break;

        case "monster_attack":
          console.log("Receive monster attack, lowering HP and raising energy:")
          Avern.Store.player.update(player => {
            const updatedPlayer = {
              ...player,
              hp: player.hp - data.damage,
              energy: player.energy + 5 >= 100 ? 100 : player.energy + 5

            }
            return updatedPlayer
          })
          console.log("HERE IS HP AFTER UPDATE?", get(Avern.Store.player).hp)
          if (get(Avern.Store.player).hp <= 0) {
              this.emitSignal("player_death")
              Avern.Sound.thudHandler.currentTime = 0.02
              Avern.Sound.thudHandler.play()
              Avern.State.playerDead = true
          } else {
            this.emitSignal("player_receive_heavy_damage")
            Avern.Sound.thudHandler.currentTime = 0.02
            Avern.Sound.thudHandler.play()
          }
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