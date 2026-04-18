import React, { useState, useRef, useCallback } from 'react'
import { BINDIS, TILAKS } from './assets/styles.js'
import { detectBindiPoint } from './lib/faceLandmarks.js'
import { detectGender } from './api/detect.js'
import StyleCarousel from './components/StyleCarousel.jsx'
import BindifyCanvas from './components/BindifyCanvas.jsx'
import LiveCamera from './components/LiveCamera.jsx'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function BindhiWordmark({ size = 62, style: extra = {} }) {
  const dotSz = Math.round(size * 0.145)
  const base = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: size, fontWeight: 700,
    background: 'linear-gradient(135deg, #E8610A 0%, #C0392B 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: size > 30 ? '-1.5px' : '-0.5px',
    lineHeight: 1, display: 'inline-flex', alignItems: 'baseline',
    ...extra,
  }
  const BindiI = () => (
    <span style={{
      position: 'relative', display: 'inline-block', lineHeight: 'inherit',
      background: 'linear-gradient(135deg, #E8610A 0%, #C0392B 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    }}>
      i
      <span style={{
        position: 'absolute', top: '0.08em', left: '50%', transform: 'translateX(-50%)',
        width: dotSz, height: dotSz, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #F5A05A, #C0392B)',
        boxShadow: `0 0 ${dotSz}px rgba(232,97,10,0.7), 0 1px 3px rgba(0,0,0,0.2)`,
        display: 'block',
      }} />
    </span>
  )
  return <span style={base}>B<BindiI />ndh<BindiI />fy</span>
}

const css = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #FDF8F2 0%, #F5EDE0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  landing: { width: '100%', maxWidth: '480px', padding: '52px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.5s ease both' },
  tagline: { fontSize: '13px', color: '#B0988A', fontWeight: '400', marginBottom: '6px', letterSpacing: '0.22em', textTransform: 'uppercase' },
  heroline: { fontSize: '15px', color: '#6A5548', textAlign: 'center', maxWidth: '300px', lineHeight: 1.7, marginBottom: '36px', fontStyle: 'italic' },
  bindiDots: { display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center', marginBottom: '36px' },
  entryCards: { display: 'flex', gap: '14px', width: '100%', maxWidth: '400px', marginBottom: '28px' },
  entryCard: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 14px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #EDE0D4', boxShadow: '0 6px 24px rgba(28,20,16,0.07)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', userSelect: 'none' },
  entryTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: '600', color: '#2C1A10', marginBottom: '6px', textAlign: 'center' },
  entryDesc: { fontSize: '12px', color: '#9A8878', textAlign: 'center', lineHeight: 1.5 },
  aboutSection: { width: '100%', maxWidth: '400px', padding: '20px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px solid #EDE0D4', marginBottom: '16px' },
  aboutTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '14px', fontWeight: '600', color: '#C0392B', marginBottom: '10px', letterSpacing: '0.02em' },
  aboutText: { fontSize: '13px', color: '#7A6E65', lineHeight: 1.75, margin: 0 },
  uploadBtn: { width: '100%', maxWidth: '300px', padding: '16px 32px', background: 'linear-gradient(135deg, #E8610A 0%, #C0392B 100%)', color: '#FFF', borderRadius: '50px', fontSize: '16px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', border: 'none', transition: 'opacity 0.15s, transform 0.1s', letterSpacing: '0.01em', boxShadow: '0 4px 20px rgba(232,97,10,0.35)' },
  privacyNote: { fontSize: '11px', color: '#BBB0A8', marginTop: '14px', textAlign: 'center', letterSpacing: '0.02em' },
  processing: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: '20px', animation: 'fadeUp 0.4s ease both' },
  spinner: { width: '48px', height: '48px', border: '3px solid #EDE8E0', borderTop: '3px solid #E8610A', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  processingText: { fontSize: '15px', color: '#7A6E65', fontWeight: '300' },
  result: { width: '100%', maxWidth: '540px', margin: '24px 0 48px', padding: '0', display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 56px rgba(28,20,16,0.16), 0 2px 8px rgba(28,20,16,0.08)', animation: 'fadeUp 0.4s ease both' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', background: '#FFFCF9', borderBottom: '1px solid #F0E8E0' },
  retryBtn: { fontSize: '12px', color: '#9A8878', background: 'none', border: '1px solid #E0D8D0', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' },
  canvasWrap: { width: '100%', background: '#18100C', position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  panel: { padding: '20px 24px', background: '#FFFFFF', borderTop: '1px solid #F0E8E0' },
  sectionLabel: { fontSize: '10px', fontWeight: '600', color: '#C4B5A8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' },
  genderToggle: { display: 'flex', gap: '8px', marginBottom: '16px' },
  genderBtn: (active) => ({ flex: 1, padding: '8px 0', fontSize: '13px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", borderRadius: '8px', border: active ? '2px solid #E8610A' : '1px solid #DDD5C8', background: active ? '#FEF3EB' : '#FAFAFA', color: active ? '#E8610A' : '#7A6E65', cursor: 'pointer', transition: 'all 0.15s' }),
  controls: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '14px', marginBottom: '2px' },
  sliderLabel: { fontSize: '12px', color: '#7A6E65', minWidth: '70px' },
  slider: { flex: 1, accentColor: '#E8610A', height: '4px' },
  noteBox: { marginTop: '12px', padding: '12px 16px', background: 'linear-gradient(135deg, #FEF3EB, #FDF0E8)', borderRadius: '12px', borderLeft: '3px solid #E8610A', fontSize: '13px', color: '#7A6E65', lineHeight: 1.6, fontStyle: 'italic' },
  actions: { display: 'flex', gap: '10px', padding: '16px 24px 28px', background: '#FFFFFF' },
  downloadBtn: { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #E8610A 0%, #C0392B 100%)', color: '#FFF', borderRadius: '14px', fontSize: '15px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', border: 'none', boxShadow: '0 4px 16px rgba(232,97,10,0.3)', transition: 'opacity 0.15s' },
  shareBtn: { flex: 1, padding: '14px', background: '#FFF9F5', color: '#C0392B', borderRadius: '14px', fontSize: '15px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', border: '1.5px solid rgba(192,57,43,0.3)', transition: 'background 0.15s' },
  errorBox: { margin: '24px 20px', padding: '16px', background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: '12px', fontSize: '14px', color: '#CF1322', lineHeight: 1.5, textAlign: 'center' },
  apiSetup: { width: '100%', maxWidth: '440px', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeUp 0.5s ease both' },
  apiInput: { width: '100%', padding: '12px 16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", border: '1.5px solid #DDD5C8', borderRadius: '10px', background: '#FFF', color: '#1C1410', outline: 'none' },
  apiSaveBtn: { padding: '12px', background: '#E8610A', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', cursor: 'pointer' },
}

function CulturalModal({ style, onClose }) {
  if (!style) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(28,20,16,0.62)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeUp 0.2s ease both' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '540px', background: '#FFFCF9', borderRadius: '24px 24px 0 0', padding: '28px 28px 48px', boxShadow: '0 -8px 40px rgba(28,20,16,0.18)', animation: 'fadeUp 0.25s ease both' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#DDD5C8', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: '#1C1410', marginBottom: 4 }}>{style.name}</div>
            {style.regions && <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, background: '#FEF3EB', color: '#C0392B', borderRadius: 20, padding: '3px 10px', letterSpacing: '0.04em' }}>{style.regions}</div>}
          </div>
          <button onClick={onClose} style={{ background: '#F5EDE0', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, lineHeight: '32px', color: '#7A6E65', flexShrink: 0 }}>✕</button>
        </div>
        <p style={{ fontSize: 14, color: '#5A4A3A', lineHeight: 1.8, marginBottom: style.occasion ? 16 : 0 }}>{style.detail || style.note}</p>
        {style.occasion && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#AAA09A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Worn for</span>
            <span style={{ fontSize: 12, color: '#7A6E65', background: '#F5EDE0', borderRadius: 20, padding: '3px 10px' }}>{style.occasion}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const PREVIEW_DOTS = [
  { color: '#C0392B', size: 13, glow: 'rgba(192,57,43,0.35)' },
  { color: '#8B1A1A', size: 10, glow: 'rgba(139,26,26,0.3)' },
  { color: '#D4527E', size: 15, glow: 'rgba(212,82,126,0.35)' },
  { color: '#B7791F', size: 11, glow: 'rgba(183,121,31,0.35)' },
  { color: '#7B2FBE', size: 13, glow: 'rgba(123,47,190,0.35)' },
  { color: '#166534', size: 9,  glow: 'rgba(22,101,52,0.3)' },
  { color: '#1A5276', size: 12, glow: 'rgba(26,82,118,0.3)' },
]

function Landing({ onUpload, onCamera }) {
  const inputRef = useRef()
  return (
    <div style={css.landing}>
      <BindhiWordmark size={62} style={{ marginBottom: '10px' }} />
      <div style={css.tagline}>The art of the mark</div>
      <div style={css.bindiDots}>
        {PREVIEW_DOTS.map((d, i) => (
          <div key={i} style={{ width: d.size * 2, height: d.size * 2, borderRadius: '50%', background: d.color, boxShadow: `0 0 ${d.size}px ${d.glow}, 0 2px 6px rgba(0,0,0,0.12)`, flexShrink: 0 }} />
        ))}
      </div>
      <p style={css.heroline}>Explore bindi and tilak styles worn across South Asia for over 5,000 years — now try them on, find your mark.</p>
      <div style={css.entryCards}>
        <div style={css.entryCard} onClick={() => inputRef.current.click()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 10 }}>
            <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <div style={css.entryTitle}>Upload a photo</div>
          <div style={css.entryDesc}>Try on styles from your gallery</div>
        </div>
        <div style={css.entryCard} onClick={onCamera}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 10 }}>
            <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          <div style={css.entryTitle}>Live camera</div>
          <div style={css.entryDesc}>See it on your face in real time</div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={onUpload} />
      <div style={css.aboutSection}>
        <div style={css.aboutTitle}>About Bindhify</div>
        <p style={css.aboutText}>
          The bindi marks the ajna chakra — the seat of intuition and inner wisdom. Worn as a symbol of marriage, devotion, and beauty, it has appeared on the foreheads of queens, dancers, and everyday women for millennia. The tilak carries equal weight for men across Shaivite, Vaishnava, and regional traditions.
          <br /><br />
          Bindhify is a space to explore these marks with curiosity and respect — whether you're reconnecting with your heritage, dressing for a celebration, or discovering a tradition for the first time.
        </p>
      </div>
      <p style={css.privacyNote}>Your photo never leaves your device · All processing is on-device</p>
    </div>
  )
}

function ControlsPanel({ catalogue, selectedStyle, selectedColor, size, nudge, setSize, setNudge, setSelectedColor, onCatalogueChange, onSelectStyle, onOpenModal }) {
  return (
    <div style={css.panel}>
      <div style={css.sectionLabel}>Style for</div>
      <div style={css.genderToggle}>
        <button style={css.genderBtn(catalogue === BINDIS)} onClick={() => onCatalogueChange(BINDIS)}>Bindi (female)</button>
        <button style={css.genderBtn(catalogue === TILAKS)} onClick={() => onCatalogueChange(TILAKS)}>Tilak (male)</button>
      </div>
      <div style={css.sectionLabel}>Choose a style</div>
      <StyleCarousel styles={catalogue} selected={selectedStyle} onSelect={onSelectStyle} />
      <div style={{ display: 'flex', gap: '8px', margin: '10px 0 14px', flexWrap: 'wrap' }}>
        {selectedStyle.colors.map(hex => (
          <button key={hex} onClick={() => setSelectedColor(hex)} style={{
            width: 28, height: 28, borderRadius: '50%', background: hex, border: 'none',
            cursor: 'pointer', flexShrink: 0,
            outline: selectedColor === hex ? `3px solid ${hex}` : '3px solid transparent',
            outlineOffset: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        ))}
      </div>
      <div style={css.controls}>
        <span style={css.sliderLabel}>Size</span>
        <input type="range" min="0.4" max="2.0" step="0.05" value={size} style={css.slider} onChange={e => setSize(parseFloat(e.target.value))} />
      </div>
      <div style={css.controls}>
        <span style={css.sliderLabel}>Position</span>
        <input type="range" min="-30" max="30" step="1" value={nudge} style={css.slider} onChange={e => setNudge(parseInt(e.target.value))} />
      </div>
      {selectedStyle && (
        <div onClick={() => onOpenModal(selectedStyle)} style={{ ...css.noteBox, cursor: 'pointer', userSelect: 'none' }}>
          <span style={{ fontStyle: 'normal', fontWeight: 500, color: '#E8610A' }}>{selectedStyle.name} — </span>
          {selectedStyle.note}
          <span style={{ float: 'right', fontSize: 13, color: '#E8610A', marginLeft: 8 }}>Learn more ›</span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState('landing')
  const [imageUrl, setImageUrl] = useState(null)
  const [detection, setDetection] = useState(null)
  const [error, setError] = useState('')
  const [catalogue, setCatalogue] = useState(BINDIS)
  const [selectedStyle, setSelectedStyle] = useState(BINDIS[0])
  const [selectedColor, setSelectedColor] = useState(BINDIS[0].colors[0])
  const [size, setSize] = useState(1.0)
  const [nudge, setNudge] = useState(0)
  const [modalStyle, setModalStyle] = useState(null)
  const canvasRef    = useRef()
  const cameraRef    = useRef()
  const fileInputRef = useRef()

  function selectStyle(s) { setSelectedStyle(s); setSelectedColor(s.colors[0]) }
  function changeCatalogue(cat) { setCatalogue(cat); selectStyle(cat[0]) }

  const handleUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(''); setNudge(0); setSize(1.0); setModalStyle(null)
    const dataUrl = await fileToDataUrl(file)
    setImageUrl(dataUrl)
    setPhase('processing')
    try {
      const img = new Image()
      img.src = dataUrl
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })

      // Downscale to max 1280px for MediaPipe — large images make faces too small to detect
      const MAX_DIM = 1280
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
      const cvs = document.createElement('canvas')
      cvs.width = Math.round(img.width * scale)
      cvs.height = Math.round(img.height * scale)
      cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height)

      const base64 = dataUrl.split(',')[1]
      const mimeType = file.type || 'image/jpeg'
      const [result, gender] = await Promise.all([
        detectBindiPoint(cvs),
        detectGender(base64, mimeType),
      ])
      if (!result.faceDetected) {
        setError("We couldn't find a face in this photo. Try a front-facing photo with good lighting.")
        setPhase('error'); return
      }
      setDetection(result)
      const cat = gender === 'male' ? TILAKS : BINDIS
      setCatalogue(cat); selectStyle(cat[0])
      setPhase('result')
    } catch (err) {
      setError('Something went wrong: ' + err.message)
      setPhase('error')
    }
  }, [])

  function handleCamera() {
    setError(''); setNudge(0); setSize(1.0)
    setCatalogue(BINDIS); selectStyle(BINDIS[0])
    setPhase('camera')
  }

  async function handleCapture() {
    const captured = cameraRef.current?.capture()
    if (!captured) return
    setImageUrl(captured.dataUrl); setDetection(captured.detection); setPhase('result')
  }

  function reset() {
    setPhase('landing'); setImageUrl(null); setDetection(null); setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleShare() {
    const dataUrl = canvasRef.current?.getDataUrl()
    if (!dataUrl) return
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'bindify.png', { type: 'image/png' })
        await navigator.share({ files: [file], title: 'Bindhify', text: 'I got Bindhified ✦ bindhifyme.in' })
        return
      } catch {}
    }
    canvasRef.current?.download()
  }

  const panelProps = { catalogue, selectedStyle, selectedColor, size, nudge, setSize, setNudge, setSelectedColor, onCatalogueChange: changeCatalogue, onSelectStyle: selectStyle, onOpenModal: setModalStyle }

  return (
    <div style={css.page}>

      {phase === 'landing' && (
        <>
          <Landing onUpload={handleUpload} onCamera={handleCamera} />
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleUpload} />
        </>
      )}

      {phase === 'processing' && (
        <div style={css.processing}>
          <div style={css.spinner} />
          <div style={css.processingText}>Finding your bindi point…</div>
        </div>
      )}

      {phase === 'error' && (
        <div style={{ width: '100%', maxWidth: '480px', padding: '24px', animation: 'fadeUp 0.4s ease both' }}>
          <BindhiWordmark size={28} style={{ marginBottom: '16px' }} />
          <div style={css.errorBox}>{error}</div>
          <button style={{ ...css.uploadBtn, marginTop: '12px', display: 'block' }} onClick={reset}>Try another photo</button>
        </div>
      )}

      {phase === 'camera' && (
        <div style={css.result}>
          <div style={css.header}>
            <span style={{ cursor: 'pointer' }} onClick={reset}><BindhiWordmark size={26} /></span>
            <button style={css.retryBtn} onClick={reset}>← Back</button>
          </div>
          <div style={{ position: 'relative' }}>
            <LiveCamera ref={cameraRef} selectedStyle={selectedStyle} color={selectedColor} size={size} nudge={nudge} />
            <button onClick={handleCapture} style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '4px solid rgba(255,255,255,0.5)', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, lineHeight: 1 }}>📸</button>
          </div>
          <ControlsPanel {...panelProps} />
        </div>
      )}

      {phase === 'result' && (
        <div style={css.result}>
          <div style={css.header}>
            <span style={{ cursor: 'pointer' }} onClick={reset}><BindhiWordmark size={26} /></span>
            <button style={css.retryBtn} onClick={reset}>Try another photo</button>
          </div>
          <div style={css.canvasWrap}>
            <BindifyCanvas ref={canvasRef} imageUrl={imageUrl} detection={detection} selectedStyle={selectedStyle} color={selectedColor} size={size} nudge={nudge} />
          </div>
          <ControlsPanel {...panelProps} />
          <div style={css.actions}>
            <button style={css.downloadBtn} onClick={() => canvasRef.current?.download()}>Download</button>
            <button style={css.shareBtn} onClick={handleShare}>Share</button>
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 24 }}>
            <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8878', fontSize: 13, fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline', textUnderlineOffset: 3 }}>← Start over</button>
          </div>
        </div>
      )}

      {modalStyle && <CulturalModal style={modalStyle} onClose={() => setModalStyle(null)} />}
    </div>
  )
}
