import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./update.js"

const SPEED = 0.05
const groundElems = document.querySelectorAll("[data-ground]")

let isGameOver = false   // 🔴 NEW

export function setupGround() {
  isGameOver = false     // 🔴 reset on restart

  setCustomProperty(groundElems[0], "--left", 0)
  setCustomProperty(groundElems[1], "--left", 300)
}

export function updateGround(delta, speedScale) {
  if (isGameOver) return   // 🔥 STOP ground after lose

  groundElems.forEach(ground => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600)
    }
  })
}

/* 🔴 NEW: call this on lose */
export function setGroundLose() {
  isGameOver = true
}
