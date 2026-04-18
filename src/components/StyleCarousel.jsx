import React from 'react'

const styles = {
  track: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '4px 2px 12px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  card: (active, color) => ({
    flex: '0 0 auto',
    width: '72px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.15s',
    transform: active ? 'translateY(-3px)' : 'none',
  }),
  swatch: (active, color) => ({
    width: '64px',
    height: '64px',
    borderRadius: '14px',
    background: '#FFF',
    border: active ? `2.5px solid #E8610A` : '2px solid #E8E0D5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 6px',
    transition: 'border-color 0.15s',
    overflow: 'hidden',
    boxShadow: active ? '0 4px 14px rgba(232,97,10,0.2)' : 'none',
  }),
  label: (active) => ({
    fontSize: '10px',
    fontWeight: active ? '500' : '400',
    color: active ? '#E8610A' : '#7A6E65',
    lineHeight: 1.2,
    maxWidth: '64px',
    margin: '0 auto',
  })
}

function SwatchCanvas({ style, size = 54 }) {
  const ref = React.useRef()
  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    const isTilak = style.id?.startsWith('T')
    if (isTilak) {
      // Tilaks anchor from bottom and grow up — place anchor at 80% height
      const s = size * 0.10
      style.render(ctx, size / 2, size * 0.82, s)
    } else {
      const s = size * 0.22
      style.render(ctx, size / 2, size / 2, s)
    }
  }, [style, size])
  return <canvas ref={ref} width={size} height={size} />
}

export default function StyleCarousel({ styles: styleList, selected, onSelect }) {
  return (
    <div style={styles.track}>
      {styleList.map(s => (
        <div key={s.id} style={styles.card(selected?.id === s.id, s.color)} onClick={() => onSelect(s)}>
          <div style={styles.swatch(selected?.id === s.id, s.color)}>
            <SwatchCanvas style={s} />
          </div>
          <div style={styles.label(selected?.id === s.id)}>{s.name}</div>
        </div>
      ))}
    </div>
  )
}
