import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./update.js"

/* 🌥️ Cloud speed – slow & smooth (Chrome-like) */
const SPEED = 0.03

/* 🌥️ All cloud elements */
const cloudsElems = document.querySelectorAll("[data-clouds]")

let isGameOver = false   // 🔴 NEW

/* 🚀 Initial setup */
export function setupclouds() {
  isGameOver = false     // 🔴 reset on restart

  // Proper spacing so gap undakunda continuous ga vastai
  setCustomProperty(cloudsElems[0], "--left", 0)
  setCustomProperty(cloudsElems[1], "--left", 120)
}

/* 🔄 Update every frame */
export function updateclouds(delta, speedScale) {
  if (isGameOver) return   // 🔥 STOP clouds after lose

  cloudsElems.forEach(cloud => {
    incrementCustomProperty(
      cloud,
      "--left",
      delta * speedScale * SPEED * -1
    )

    // 🔁 Reset EARLY (no long empty sky)
    if (getCustomProperty(cloud, "--left") <= -120) {
      incrementCustomProperty(cloud, "--left", 240)
    }
  })
}

/* 🔴 NEW: call this on lose */
export function setCloudsLose() {
  isGameOver = true
}
