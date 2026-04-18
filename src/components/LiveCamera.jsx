import React, {
  useEffect, useRef, useState, forwardRef, useImperativeHandle,
} from 'react'
import { getVideoLandmarker, processLandmarks } from '../lib/faceLandmarks.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawBindi(ctx, detection, mirrored, style, color, size, nudge, w, h) {
  if (!detection || !style) return
  const isTilak = style.id.startsWith('T')
  const pt = isTilak ? detection.tilakPoint : detection.bindiPoint

  // Mirror x for front-facing camera feed
  const fx = (mirrored ? 1 - pt.x : pt.x) * w
  const fy = pt.y * h + nudge
  const baseS = detection.faceWidth * w * 0.062 * size
  const roll  = mirrored ? -(detection.rollAngle || 0) : (detection.rollAngle || 0)

  ctx.save()
  ctx.translate(fx, fy)
  ctx.rotate(roll)
  ctx.translate(-fx, -fy)
  style.render(ctx, fx, fy, baseS, color)
  ctx.restore()
}

// ── Component ─────────────────────────────────────────────────────────────────

const LiveCamera = forwardRef(function LiveCamera(
  { selectedStyle, color, size, nudge },
  ref
) {
  const canvasRef    = useRef()
  const videoRef     = useRef()
  const streamRef    = useRef()
  const rafRef       = useRef()
  const detectionRef = useRef(null)
  const lmRef        = useRef(null)

  const [facingMode, setFacingMode] = useState('user')
  const [status, setStatus]         = useState('starting') // starting | live | noface | error

  // Stable ref so RAF loop always sees latest props without re-creating the loop
  const propsRef = useRef({ selectedStyle, color, size, nudge })
  useEffect(() => { propsRef.current = { selectedStyle, color, size, nudge } })

  // ── Capture ─────────────────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    capture() {
      const video = videoRef.current
      const detection = detectionRef.current
      if (!video) return null

      const w = video.videoWidth, h = video.videoHeight
      const cvs = document.createElement('canvas')
      cvs.width = w; cvs.height = h
      const ctx = cvs.getContext('2d')
      const mirrored = facingMode === 'user'

      // Raw frame only — BindifyCanvas handles bindi + watermark on the result screen
      if (mirrored) {
        ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -w, 0); ctx.restore()
      } else {
        ctx.drawImage(video, 0, 0)
      }

      // Produce a detection with x already flipped to match the mirrored image
      const finalDetection = detection && mirrored ? {
        ...detection,
        bindiPoint: { x: 1 - detection.bindiPoint.x, y: detection.bindiPoint.y },
        tilakPoint: { x: 1 - detection.tilakPoint.x, y: detection.tilakPoint.y },
        rollAngle: -detection.rollAngle,
      } : detection

      return { dataUrl: cvs.toDataURL('image/png'), detection: finalDetection }
    }
  }), [facingMode])

  // ── Camera + RAF loop ────────────────────────────────────────────────────────

  useEffect(() => {
    let active = true

    async function start() {
      try {
        // Kill previous stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop())
          streamRef.current = null
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }

        streamRef.current = stream
        videoRef.current.srcObject = stream
        await videoRef.current.play()

        lmRef.current = await getVideoLandmarker()
        if (!active) return

        function loop() {
          if (!active) return
          const video  = videoRef.current
          const canvas = canvasRef.current
          if (!video || !canvas || video.readyState < 2) {
            rafRef.current = requestAnimationFrame(loop); return
          }

          const w = video.videoWidth, h = video.videoHeight
          if (canvas.width !== w)  canvas.width  = w
          if (canvas.height !== h) canvas.height = h

          const mirrored = facingMode === 'user'
          const ctx = canvas.getContext('2d')

          // Draw frame (mirrored for selfie camera)
          if (mirrored) {
            ctx.save(); ctx.scale(-1, 1); ctx.drawImage(video, -w, 0); ctx.restore()
          } else {
            ctx.drawImage(video, 0, 0, w, h)
          }

          // Detect landmarks
          const result = lmRef.current.detectForVideo(video, performance.now())
          if (result.faceLandmarks?.length) {
            const det = processLandmarks(result.faceLandmarks[0])
            detectionRef.current = det
            setStatus('live')
            const { selectedStyle: st, color: c, size: sz, nudge: nd } = propsRef.current
            drawBindi(ctx, det, mirrored, st, c, sz, nd, w, h)
          } else {
            detectionRef.current = null
            setStatus('noface')
          }

          rafRef.current = requestAnimationFrame(loop)
        }

        setStatus('live')
        rafRef.current = requestAnimationFrame(loop)

      } catch (err) {
        if (active) setStatus('error')
      }
    }

    start()
    return () => {
      active = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [facingMode])

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: 'relative', width: '100%', background: '#0E0A08', lineHeight: 0 }}>
      {/* Hidden video source */}
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />

      {/* Main canvas — video + overlay rendered here */}
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block', minHeight: 280 }} />

      {/* Starting overlay */}
      {status === 'starting' && (
        <div style={S.overlay}>
          <div style={S.spinner} />
          <span style={S.overlayLabel}>Starting camera…</span>
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div style={S.overlay}>
          <span style={{ fontSize: 32 }}>📷</span>
          <span style={S.overlayLabel}>Camera unavailable</span>
          <span style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>
            Check browser permissions
          </span>
        </div>
      )}

      {/* No face toast */}
      {status === 'noface' && (
        <div style={S.toast}>Center your face</div>
      )}

      {/* Face guide oval */}
      {(status === 'noface' || status === 'starting') && (
        <svg style={S.guide} viewBox="0 0 100 130" preserveAspectRatio="none">
          <ellipse cx="50" cy="55" rx="34" ry="44"
            fill="none" stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
      )}

      {/* Flip camera button */}
      <button style={S.flipBtn} onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
      </button>

      {/* Live indicator */}
      {status === 'live' && (
        <div style={S.liveIndicator}>
          <span style={S.liveDot} />
          LIVE
        </div>
      )}
    </div>
  )
})

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(14,10,8,0.85)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  overlayLabel: { color: '#D0C8C0', fontSize: 14, fontFamily: "'DM Sans', sans-serif" },
  spinner: {
    width: 36, height: 36,
    border: '2.5px solid rgba(255,255,255,0.1)',
    borderTop: '2.5px solid #E8610A',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  toast: {
    position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
    color: '#FFF', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    padding: '7px 18px', borderRadius: 20,
    pointerEvents: 'none', whiteSpace: 'nowrap',
  },
  guide: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
  },
  flipBtn: {
    position: 'absolute', top: 14, right: 14,
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  liveIndicator: {
    position: 'absolute', top: 14, left: 14,
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
    color: '#FFF', fontSize: 11, fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, letterSpacing: '0.08em',
    padding: '5px 10px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.15)',
  },
  liveDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#E8610A',
    boxShadow: '0 0 6px #E8610A',
    animation: 'pulse 1.5s ease infinite',
    display: 'inline-block',
  },
}

export default LiveCamera
