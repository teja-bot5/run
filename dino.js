import { getCustomProperty, setCustomProperty } from "./update.js"

const dinoElem = document.querySelector("[data-dino]")

/* ===== PHYSICS ===== */
const JUMP_FORCE = 0.6
const GRAVITY = 0.0022

/* ===== RUN ANIMATION ===== */
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 120 // ms (lower = faster run)

/* ===== STATE ===== */
let isJumping
let isGameOver
let yVelocity
let dinoFrame
let frameTimer

/* ================= SETUP ================= */
export function setupDino() {
  isJumping = false
  isGameOver = false
  yVelocity = 0
  dinoFrame = 0
  frameTimer = 0

  setCustomProperty(dinoElem, "--bottom", 0)
  dinoElem.src = "./images/dino-run-0.png"
  dinoElem.style.setProperty("--dino-size", "36%")
}

/* ================= UPDATE ================= */
export function updateDino(delta) {
  if (isGameOver) return

  handleRun(delta)
  handleJump(delta)
}

/* ================= RUN ================= */
function handleRun(delta) {
  if (isJumping) {
    dinoElem.src = "./images/dino-stationary.png"
    return
  }

  frameTimer += delta
  if (frameTimer >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `./images/dino-run-${dinoFrame}.png`
    frameTimer -= FRAME_TIME
  }
}

/* ================= JUMP ================= */
function handleJump(delta) {
  if (!isJumping) return

  const bottom =
    getCustomProperty(dinoElem, "--bottom") + yVelocity * delta
  setCustomProperty(dinoElem, "--bottom", bottom)

  yVelocity -= GRAVITY * delta

  if (bottom <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
    yVelocity = 0
  }
}

/* ================= HITBOX ================= */
export function getDinoRect() {
  const rect = dinoElem.getBoundingClientRect()
  return {
    left: rect.left + rect.width * 0.25,
    right: rect.right - rect.width * 0.25,
    top: rect.top + rect.height * 0.2,
    bottom: rect.bottom - rect.height * 0.1,
  }
}

/* ================= LOSE ================= */
export function setDinoLose() {
  isGameOver = true
  isJumping = false
  yVelocity = 0

  setCustomProperty(dinoElem, "--bottom", 0)
  dinoElem.src = "./images/dino-lose.png"
  dinoElem.style.setProperty("--dino-size", "37%")
}

/* ================= INPUT ================= */
document.addEventListener("keydown", e => {
  if (e.code !== "Space" || isJumping || isGameOver) return
  yVelocity = JUMP_FORCE
  isJumping = true
})
