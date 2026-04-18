import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

// Renders the user photo + bindi/tilak overlay onto a canvas
const BindifyCanvas = forwardRef(function BindifyCanvas(
  { imageUrl, detection, selectedStyle, size, nudge, color },
  ref
) {
  const canvasRef = useRef()

  useImperativeHandle(ref, () => ({
    download() {
      const canvas = canvasRef.current
      if (!canvas) return
      const link = document.createElement('a')
      link.download = 'bindify.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    },
    getDataUrl() {
      return canvasRef.current?.toDataURL('image/png')
    }
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageUrl || !detection?.faceDetected) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      // Set canvas to image dimensions (capped for performance)
      const MAX = 900
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      if (!selectedStyle || !detection.bindiPoint) return

      const isTilak = selectedStyle.id.startsWith('T')
      const point = isTilak ? detection.tilakPoint : detection.bindiPoint
      const fx = point.x * canvas.width
      const fy = point.y * canvas.height + nudge
      const faceW = detection.faceWidth * canvas.width
      const baseS = faceW * 0.062 * size

      // Apply face roll rotation so tilak/bindi aligns with the face tilt
      const roll = detection.rollAngle || 0
      ctx.save()
      ctx.translate(fx, fy)
      ctx.rotate(roll)
      ctx.translate(-fx, -fy)
      selectedStyle.render(ctx, fx, fy, baseS, color)
      ctx.restore()

      // ── Watermark ──────────────────────────────────────────────────────────
      const barH   = Math.max(30, Math.round(canvas.height * 0.065))
      const barY   = canvas.height - barH
      const margin = barH * 0.55
      const dr     = barH * 0.21

      // Semi-transparent strip
      ctx.fillStyle = 'rgba(8,4,2,0.52)'
      ctx.fillRect(0, barY, canvas.width, barH)

      // Bindi dot
      const grd = ctx.createRadialGradient(margin, barY + barH / 2, 0, margin, barY + barH / 2, dr * 1.4)
      grd.addColorStop(0, '#F5A05A')
      grd.addColorStop(1, '#C0392B')
      ctx.beginPath()
      ctx.arc(margin, barY + barH / 2, dr, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      // Tag text
      const fs = Math.max(11, Math.round(barH * 0.37))
      ctx.font = `500 ${fs}px 'DM Sans', sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.90)'
      ctx.textBaseline = 'middle'
      ctx.fillText('I got Bindhified  ✦  bindhifyme.in', margin * 2 + dr, barY + barH / 2)
    }
    img.src = imageUrl
  }, [imageUrl, detection, selectedStyle, size, nudge, color])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '12px',
      }}
    />
  )
})

export default BindifyCanvas
