import './app.css'
import gsap from "gsap"
import Engine from "./Engine"
window.Avern = Engine

import stagingBase from "../assets/wts-base.gltf"

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
