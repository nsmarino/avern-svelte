import * as THREE from 'three';
import gsap from "gsap"

import GameplayComponent from '../_Component';

class Notices extends GameplayComponent {
    constructor(gameObject, ) {
        super(gameObject)
        this.container = document.querySelector("#notices-container")
    }

    onSignal(signalName, data) {
      switch(signalName) {
        case "show_notice":
          const el = document.createElement("p")
          el.innerText = data.notice
          el.style.color = data.color
          this.container.appendChild(el)
          setTimeout(() => {
            gsap.to(el, {opacity:0, y: -20, onComplete: ()=>el.remove()})
          }, data.delay)
          break;
      }
    }

    attachObservers(parent) {
    }
}

export default Notices