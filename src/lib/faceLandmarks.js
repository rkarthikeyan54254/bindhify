import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const WASM_URL   = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'

const LEFT_INNER_BROW  = 107
const RIGHT_INNER_BROW = 336
const LEFT_EAR         = 234
const RIGHT_EAR        = 454
const LEFT_EYE_OUTER   = 33
const RIGHT_EYE_OUTER  = 263
const FOREHEAD_TOP     = 10
const CHIN             = 152

// ── Shared builder ────────────────────────────────────────────────────────────

async function buildLandmarker(runningMode) {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL)
  // CPU for IMAGE mode is more reliable for complex photos (sunglasses, group shots)
  // GPU for VIDEO mode keeps the live camera fast
  const delegate = runningMode === 'VIDEO' ? 'GPU' : 'CPU'
  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode,
    numFaces: 4,
    minFaceDetectionConfidence: 0.3,
    minFacePresenceConfidence: 0.3,
    minTrackingConfidence: 0.3,
  })
}

// ── Singleton instances (IMAGE vs VIDEO) ──────────────────────────────────────

let imageLandmarker = null
let videoLandmarker = null

// ── Landmark → detection object ───────────────────────────────────────────────

export function processLandmarks(pts) {
  const lBrow = pts[LEFT_INNER_BROW]
  const rBrow = pts[RIGHT_INNER_BROW]
  const lEye  = pts[LEFT_EYE_OUTER]
  const rEye  = pts[RIGHT_EYE_OUTER]

  const bindiX = (lBrow.x + rBrow.x) / 2
  const bindiY = (lBrow.y + rBrow.y) / 2

  const foreheadY  = pts[FOREHEAD_TOP].y
  const chinY      = pts[CHIN].y
  const faceHeight = Math.abs(chinY - foreheadY)

  return {
    faceDetected: true,
    bindiPoint: { x: bindiX, y: bindiY },
    tilakPoint: { x: bindiX, y: bindiY - faceHeight * 0.07 },
    faceWidth:  Math.abs(pts[LEFT_EAR].x - pts[RIGHT_EAR].x),
    rollAngle:  Math.atan2(rEye.y - lEye.y, rEye.x - lEye.x),
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function detectBindiPoint(imageElement) {
  if (!imageLandmarker) imageLandmarker = await buildLandmarker('IMAGE')
  const result = imageLandmarker.detect(imageElement)
  if (!result.faceLandmarks?.length) return { faceDetected: false, faces: [] }

  const faces = result.faceLandmarks.map(pts => processLandmarks(pts))
  // Primary detection = largest face (widest faceWidth)
  const primary = faces.reduce((a, b) => a.faceWidth > b.faceWidth ? a : b)
  return { ...primary, faces }
}

export async function getVideoLandmarker() {
  if (!videoLandmarker) videoLandmarker = await buildLandmarker('VIDEO')
  return videoLandmarker
}
