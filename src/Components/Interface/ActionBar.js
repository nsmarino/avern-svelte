import * as THREE from 'three';
import gsap from "gsap"

import GameplayComponent from '../_Component';

class ActionBar extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.bar = document.querySelector("#casting-bar")
        this.caption = document.querySelector("#casting-bar-caption")
        this.EquipmentInterface = document.querySelector(".equipped")

    }


    onSignal(signalName, data) {
      switch(signalName) {
        case "casting_start":
          gsap.set(this.bar, { opacity: 1 })
          this.caption.innerText = data.caption
          break;

        case "casting_progress":
          document.documentElement.style.setProperty("--player-casting-width", `${(data.progress / data.threshold) * 100 }%`);
          break;

        case "casting_interrupt":
          gsap.set(this.bar, { opacity: 0 })
          break;

        case "casting_reduce":
          document.documentElement.style.setProperty("--player-casting-width", `${(data.progress / data.threshold) * 100 }%`);
          break;

        case "casting_finish":
          gsap.set(this.bar, { opacity: 0 })

          this.EquipmentInterface.querySelectorAll(".equipment-action").forEach(input => {
            // gsap.set(input, {borderColor: "white", scale: 1})
            input.classList.remove("is-prepared")
          })
          const primedActionInput = this.EquipmentInterface.querySelector(`#${data.action.input}`)
          // gsap.to(primedActionInput, { borderColor: "blue", scale: 1.15, duration: 0.1})
            primedActionInput.classList.add("is-prepared")

          break;

        case "action_availed":
          const availedActionInput = this.EquipmentInterface.querySelector(`#${data.action.input}`)
          availedActionInput.classList.remove("is-prepared")
          // gsap.to(availedActionInput, { borderColor: "white", scale: 1, duration: 0.1})
          break;
      }
    }

    attachObservers(parent) {
  }
}

export default ActionBar