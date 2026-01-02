import { updateGround, setupGround } from "./ground.js"
import { updateclouds, setupclouds } from "./clouds.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js"
import {
  updateCactus,
  setupCactus,
  getCactusRects,
  setCactusLose,
} from "./cactus.js"

/* ===== WORLD CONFIG ===== */
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30

/* ===== SPEED CONFIG (FIXED) ===== */
const SPEED_SCALE_INCREASE = 0.000006   // 🔥 very slow ramp
const MAX_SPEED_SCALE = 1.25            // 🔥 hard cap (no madness)

/* ===== ELEMENTS ===== */
const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const highScoreElem = document.querySelector("[data-highscore]")
const startScreenElem = document.querySelector("[data-start-screen]")

/* ===== STATE ===== */
let lastTime = null
let speedScale = 1
let score = 0
let isGameOver = false

/* ===== HIGH SCORE ===== */
let highScore = Number(sessionStorage.getItem("highscore")) || 0

/* ===== INIT ===== */
setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

if (highScore > 0) {
  highScoreElem.innerHTML = `<span class="high">HI</span> ${highScore}`
  highScoreElem.classList.remove("hide")
} else {
  highScoreElem.classList.add("hide")
}

/* ===== GAME LOOP ===== */
function updateGame(time) {
  if (lastTime == null) {
    lastTime = time
    requestAnimationFrame(updateGame)
    return
  }

  let delta = time - lastTime
  if (delta > 40) delta = 40

  if (!isGameOver) {
    updateclouds(delta, speedScale)
    updateGround(delta, speedScale)
    updateDino(delta)
    updateCactus(delta, speedScale)

    if (checkLose()) handleLose()

    updateSpeedScale(delta)
    updateScore(delta)
  }

  lastTime = time
  requestAnimationFrame(updateGame)
}

/* ===== COLLISION ===== */
function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(a, b) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  )
}

/* ===== SPEED ===== */
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
  if (speedScale > MAX_SPEED_SCALE) speedScale = MAX_SPEED_SCALE
}

/* ===== SCORE ===== */
function updateScore(delta) {
  score += delta * 0.007 * speedScale   // 🔥 slower score
  scoreElem.textContent = Math.floor(score)
}

/* ===== START ===== */
function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  isGameOver = false

  setupclouds()
  setupGround()
  setupDino()
  setupCactus()

  startScreenElem.classList.add("hide")
  requestAnimationFrame(updateGame)
}

/* ===== LOSE ===== */
function handleLose() {
  isGameOver = true

  setDinoLose()
  setCactusLose()

  const finalScore = Math.floor(score)
  if (finalScore > highScore) {
    highScore = finalScore
    sessionStorage.setItem("highscore", highScore)
  }

  highScoreElem.innerHTML = `<span class="high">HI</span> ${highScore}`
  highScoreElem.classList.remove("hide")

  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    startScreenElem.classList.remove("hide")
  }, 300)
}

/* ===== SCALE ===== */
function setPixelToWorldScale() {
  let scale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    scale = window.innerWidth / WORLD_WIDTH
  } else {
    scale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * scale}px`
  worldElem.style.height = `${WORLD_HEIGHT * scale}px`
}

/* ===== 📱 MOBILE TAP ===== */
document.addEventListener(
  "touchstart",
  e => {
    e.preventDefault()

    if (!startScreenElem.classList.contains("hide")) {
      handleStart()
      return
    }

    const evt = new KeyboardEvent("keydown", { code: "Space" })
    document.dispatchEvent(evt)
  },
  { passive: false }
)
