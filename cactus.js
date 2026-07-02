import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./update.js"

/* ================= CONFIG ================= */

const SPEED = 0.055

const CACTUS_INTERVAL_MIN = 600
const CACTUS_INTERVAL_MAX = 1600

const MIN_CACTUS_GAP = 35

const worldElem = document.querySelector("[data-world]")

let nextCactusTime = 0
let isGameOver = false

/* ================= SETUP ================= */
export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN
  isGameOver = false
  document.querySelectorAll("[data-cactus]").forEach(c => c.remove())
}

/* ================= UPDATE ================= */
export function updateCactus(delta, speedScale) {
  if (isGameOver) return

  const movement = delta * speedScale * SPEED * -1

  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left", movement)
    if (getCustomProperty(cactus, "--left") <= -15) cactus.remove()
  })

  if (nextCactusTime <= 0 && canSpawnCactus()) {
    spawnCactusGroup()
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale
  }

  nextCactusTime -= delta
}

/* ================= COLLISION ================= */
export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
    const r = cactus.getBoundingClientRect()
    return {
      left: r.left + r.width * 0.25,
      right: r.right - r.width * 0.25,
      top: r.top + r.height * 0.2,
      bottom: r.bottom,
    }
  })
}

/* ================= GAME OVER ================= */
export function setCactusLose() {
  isGameOver = true
}

/* ================= SPAWN GROUP ================= */

function spawnCactusGroup() {
  const roll = Math.random()
  const baseLeft = 100

  // 85% → single
  if (roll < 0.85) {
    createCactus(baseLeft)
    return
  }

  // 10% → double (tiny overlap look)
  if (roll < 0.95) {
    createCactus(baseLeft)
    createCactus(baseLeft + 3)
    return
  }

  // 4% → triple (controlled overlap)
  if (roll < 0.99) {
    createCactus(baseLeft)
    createCactus(baseLeft + 2)
    createCactus(baseLeft + 4)
    return
  }

  // 1% → quad (still readable)
  createCactus(baseLeft)
  createCactus(baseLeft + 2)
  createCactus(baseLeft + 4)
  createCactus(baseLeft + 6)
}

/* ================= CREATE CACTUS ================= */

function createCactus(leftPos) {
  const cactus = document.createElement("img")
  cactus.dataset.cactus = true
  cactus.src = "images/cactus.png"
  cactus.classList.add("cactus")

  // 🔥 FIXED sizes
  const sizes = [0.7, 0.85, 1.0, 1.15]
  const scale = sizes[Math.floor(Math.random() * sizes.length)]

  /* 🔥 IMPORTANT: ground alignment */
  cactus.style.transformOrigin = "bottom center"
  cactus.style.transform = `scale(${scale})`

  setCustomProperty(cactus, "--left", leftPos)
  worldElem.append(cactus)
}

/* ================= GAP CONTROL ================= */
function canSpawnCactus() {
  const c = document.querySelectorAll("[data-cactus]")
  if (c.length === 0) return true
  const last = c[c.length - 1]
  return getCustomProperty(last, "--left") < 100 - MIN_CACTUS_GAP
}

/* ================= HELPERS ================= */
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
