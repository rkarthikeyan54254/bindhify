// render(ctx, x, y, size, color) — color is the user-selected primary color

export const BINDIS = [
  {
    id: 'B01', name: 'Classic Round',
    note: 'The timeless everyday bindi, worn across all traditions',
    detail: 'The round red bindi is the most universally recognised forehead mark in Indian culture. Worn daily by millions of women across every state, it sits at the ajna chakra — the seat of intuition. Traditionally associated with marriage and auspiciousness, today it is worn equally as a cultural statement and fashion choice. Red kumkum, the most common material, is made from turmeric and lime.',
    regions: 'Pan-India',
    occasion: 'Daily, weddings, festivals',
    colors: ['#C0392B','#1C1410','#B7791F','#D4527E','#6B21A8'],
    render: (ctx, x, y, s, color = '#C0392B') => {
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
    }
  },
  {
    id: 'B02', name: 'Teardrop',
    note: 'Popular in South India, associated with classical dance',
    detail: 'The teardrop bindi — pointed at the top, rounded at the base — is deeply associated with Bharatanatyam and Kuchipudi classical dance traditions. It elongates the forehead and draws the eye upward, creating the dramatic aesthetic of classical South Indian costuming. Off stage, it is popular in Tamil Nadu, Andhra Pradesh, and Kerala as a festive bindi.',
    regions: 'Tamil Nadu, Andhra Pradesh, Kerala',
    occasion: 'Classical dance, festivals, weddings',
    colors: ['#8B1A1A','#1C1410','#B7791F','#6B21A8','#166534'],
    render: (ctx, x, y, s, color = '#8B1A1A') => {
      ctx.save(); ctx.translate(x, y); ctx.beginPath()
      ctx.moveTo(0, -s * 1.6)
      ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.9, s * 0.4, 0, s * 0.8)
      ctx.bezierCurveTo(-s * 0.9, s * 0.4, -s * 0.9, -s * 0.6, 0, -s * 1.6)
      ctx.fillStyle = color; ctx.fill(); ctx.restore()
    }
  },
  {
    id: 'B03', name: 'Floral',
    note: 'Modern fashion bindi, common at festive and bridal occasions',
    detail: 'Floral bindis emerged in the 1980s as decorative stick-on alternatives to traditional paste bindis. Today they are a major fashion category — sold in elaborate sets with matching earring and necklace designs. Most popular for Navratri, Diwali, and weddings, where women often match the bindi colour and design to their saree or lehenga.',
    regions: 'Pan-India, especially Gujarat and Maharashtra',
    occasion: 'Navratri, Diwali, weddings, festive',
    colors: ['#D4527E','#C0392B','#7B2FBE','#B7791F','#166534'],
    render: (ctx, x, y, s, color = '#D4527E') => {
      for (let i = 0; i < 6; i++) {
        ctx.save(); ctx.translate(x, y); ctx.rotate((i / 6) * Math.PI * 2)
        ctx.beginPath(); ctx.ellipse(0, -s * 0.9, s * 0.4, s * 0.7, 0, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.fill(); ctx.restore()
      }
      ctx.beginPath(); ctx.arc(x, y, s * 0.45, 0, Math.PI * 2)
      ctx.fillStyle = '#F5A05A'; ctx.fill()
    }
  },
  {
    id: 'B04', name: 'Bridal Red',
    note: 'Large red bindi traditionally worn by married Hindu women',
    detail: 'The large red bridal bindi is one of the most powerful symbols in Hindu matrimonial tradition. Applied as part of the solah shringar (sixteen adornments of a bride), it signals marital status and divine blessing. In many traditions, the bindi is applied by the groom himself during the wedding. The deep red colour symbolises Shakti — feminine power and life force.',
    regions: 'Pan-India, especially North and East India',
    occasion: 'Weddings, post-marriage daily wear',
    colors: ['#991B1B','#B7791F','#6B21A8','#1C1410','#1A5276'],
    render: (ctx, x, y, s, color = '#991B1B') => {
      ctx.beginPath(); ctx.arc(x, y, s * 1.1, 0, Math.PI * 2)
      ctx.fillStyle = color + 'BB'; ctx.fill()
      ctx.beginPath(); ctx.arc(x, y, s * 0.72, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x - s * 0.2, y - s * 0.2, s * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill()
    }
  },
  {
    id: 'B05', name: 'Crystal Stud',
    note: 'Contemporary style, popular among younger women',
    detail: 'The crystal or gem-set bindi is a modern evolution that bridges traditional practice with contemporary jewellery. Inspired by maang tikka and nose ring aesthetics, it uses Swarovski crystals, rhinestones, or coloured stones set in adhesive mounts. Particularly popular among diaspora women and at fusion weddings, it makes the bindi accessible to those who want something subtle and wearable in any context.',
    regions: 'Pan-India, diaspora worldwide',
    occasion: 'Contemporary daily, parties, fusion events',
    colors: ['#7B2FBE','#1A5276','#D4527E','#166534','#B7791F'],
    render: (ctx, x, y, s, color = '#7B2FBE') => {
      const grd = ctx.createRadialGradient(x, y, 0, x, y, s * 1.2)
      grd.addColorStop(0, color + '80'); grd.addColorStop(1, color + '00')
      ctx.beginPath(); ctx.arc(x, y, s * 1.2, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()
      ctx.beginPath(); ctx.arc(x, y, s * 0.65, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x - s * 0.18, y - s * 0.18, s * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill()
    }
  },
  {
    id: 'B06', name: 'Chandra Bindi',
    note: 'Marathi crescent bindi — the chandra worn by brides, horns pointing upward',
    detail: 'The crescent (chandra) bindi is particularly associated with Maharashtrian bridal tradition. The horns point upward toward the sky, symbolising the crescent moon worn by Lord Shiva — an auspicious connection for a new bride. It is traditionally worn alongside the nath (nose ring) and green bangles that are the signature of a Maharashtrian nauvari saree bride.',
    regions: 'Maharashtra, Goa, parts of Karnataka',
    occasion: 'Weddings, Ganesh Chaturthi, Gudi Padwa',
    colors: ['#8B1A1A','#C0392B','#B7791F','#6B21A8','#1A5276'],
    render: (ctx, x, y, s, color = '#8B1A1A') => {
      // Offscreen canvas ensures clean cutout regardless of photo background
      const pad = Math.ceil(s * 1.4)
      const oc = document.createElement('canvas')
      oc.width = pad * 2; oc.height = pad * 2
      const oc2 = oc.getContext('2d')
      const cx = pad, cy = pad
      // Outer circle
      oc2.beginPath(); oc2.arc(cx, cy, s, 0, Math.PI * 2)
      oc2.fillStyle = color; oc2.fill()
      // Inner circle shifted UP → leaves crescent with horns pointing up (Marathi style)
      oc2.globalCompositeOperation = 'destination-out'
      oc2.beginPath(); oc2.arc(cx, cy - s * 0.38, s * 0.76, 0, Math.PI * 2)
      oc2.fillStyle = 'rgba(0,0,0,1)'; oc2.fill()
      ctx.drawImage(oc, x - cx, y - cy)
      // Small dot below crescent
      ctx.beginPath(); ctx.arc(x, y + s * 1.4, s * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
    }
  },
  {
    id: 'B07', name: 'Elongated Leaf',
    note: 'Common in classical Bharatanatyam costuming',
    detail: 'The elongated leaf or paisley bindi is a staple of classical Indian dance makeup. Its vertical orientation creates a visual extension of the face upward, emphasising the dancer\'s expressions during performance. The shape echoes the mango or paisley motif (kalka) that appears throughout Indian textiles and jewellery. It is also worn in Odissi, Manipuri, and Mohiniattam traditions.',
    regions: 'Tamil Nadu, Odisha, Kerala, Manipur',
    occasion: 'Classical dance performances, dance recitals',
    colors: ['#166534','#B7791F','#C0392B','#1A5276','#1C1410'],
    render: (ctx, x, y, s, color = '#166534') => {
      ctx.save(); ctx.translate(x, y); ctx.beginPath()
      ctx.moveTo(0, -s * 1.8)
      ctx.bezierCurveTo(s * 1.0, -s * 0.8, s * 1.0, s * 0.8, 0, s * 1.8)
      ctx.bezierCurveTo(-s * 1.0, s * 0.8, -s * 1.0, -s * 0.8, 0, -s * 1.8)
      ctx.fillStyle = color; ctx.fill(); ctx.restore()
    }
  },
  {
    id: 'B08', name: 'Kundan Cluster',
    note: 'Ornate festive bindi, worn at weddings and pujas',
    detail: 'The kundan cluster bindi mimics the traditional kundan jewellery technique — uncut gemstones set in gold foil — that originated in Rajasthan and Gujarat. As a bindi, it creates the effect of a forehead jewel without piercing. Multi-piece cluster bindis are sold in elaborate sets and often trail down the centre of the hairline (maang design). They are worn by brides and guests at Rajasthani and Gujarati weddings.',
    regions: 'Rajasthan, Gujarat, North India',
    occasion: 'Weddings, sangeet, Navratri',
    colors: ['#B7791F','#C0392B','#6B21A8','#166534','#1A5276'],
    render: (ctx, x, y, s, color = '#B7791F') => {
      [[0, 0, 1.0], [-s*1.05,-s*0.5,0.55],[s*1.05,-s*0.5,0.55],
       [0,-s*1.15,0.55],[-s*0.6,s*0.9,0.45],[s*0.6,s*0.9,0.45]]
      .forEach(([dx, dy, sc]) => {
        ctx.beginPath(); ctx.arc(x+dx, y+dy, s*sc, 0, Math.PI*2)
        ctx.fillStyle = color; ctx.fill()
        ctx.beginPath(); ctx.arc(x+dx-s*sc*0.25, y+dy-s*sc*0.25, s*sc*0.28, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(255,245,200,0.5)'; ctx.fill()
      })
    }
  },
  {
    id: 'B09', name: 'Diamond',
    note: 'Geometric diamond shape, popular in contemporary and Bollywood styles',
    detail: 'The diamond bindi is a bold geometric shape that emerged from Bollywood costume design and contemporary fashion. Its sharp angles create a striking contrast with the soft curves of the face. Popular in the 1990s and experiencing a revival in modern South Asian fashion, it is often worn with high-drama eye makeup in editorial and stage contexts.',
    regions: 'Pan-India, Bollywood influence',
    occasion: 'Stage, editorial, contemporary fashion',
    colors: ['#C0392B','#1C1410','#B7791F','#D4527E','#7B2FBE'],
    render: (ctx, x, y, s, color = '#C0392B') => {
      ctx.save(); ctx.translate(x, y); ctx.beginPath()
      ctx.moveTo(0, -s * 1.5); ctx.lineTo(s * 0.9, 0)
      ctx.lineTo(0, s * 1.5); ctx.lineTo(-s * 0.9, 0); ctx.closePath()
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.moveTo(0, -s * 1.5); ctx.lineTo(s * 0.9, 0); ctx.lineTo(0, 0); ctx.closePath()
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill()
      ctx.restore()
    }
  },
  {
    id: 'B10', name: 'Lotus',
    note: 'Sacred lotus bindi, symbol of purity and spiritual awakening',
    detail: 'The lotus (padma) is one of the most sacred symbols in Hinduism, Buddhism, and Jainism — representing spiritual awakening, purity emerging from mud, and the unfolding of consciousness. As a bindi, it carries deep meditative significance. Eight petals represent the eight directions and the ashtadala padma used in temple floor designs. It is a popular choice for puja days and spiritual ceremonies.',
    regions: 'Pan-India, especially Bengal and Odisha',
    occasion: 'Puja, Saraswati Puja, Lakshmi Puja, spiritual',
    colors: ['#D4527E','#C0392B','#B7791F','#7B2FBE','#166534'],
    render: (ctx, x, y, s, color = '#D4527E') => {
      for (let i = 0; i < 8; i++) {
        ctx.save(); ctx.translate(x, y); ctx.rotate((i / 8) * Math.PI * 2)
        ctx.beginPath()
        ctx.moveTo(0, 0); ctx.bezierCurveTo(s*0.5, -s*0.5, s*0.5, -s*1.4, 0, -s*1.4)
        ctx.bezierCurveTo(-s*0.5, -s*1.4, -s*0.5, -s*0.5, 0, 0)
        ctx.fillStyle = color; ctx.fill(); ctx.restore()
      }
      ctx.beginPath(); ctx.arc(x, y, s * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = '#F5A05A'; ctx.fill()
    }
  },
  {
    id: 'B11', name: 'Star Burst',
    note: 'Radiant star bindi — festive and celebratory style',
    detail: 'The starburst bindi radiates energy outward from the ajna chakra — visually expressing the idea of inner light shining outward. Popularised in contemporary Indian fashion and at music festivals, it has become a crossover piece worn both within and outside the South Asian community. Gold versions are particularly popular at Diwali celebrations for their association with light, prosperity, and Lakshmi.',
    regions: 'Pan-India, diaspora worldwide',
    occasion: 'Diwali, Navratri, festivals, parties',
    colors: ['#B7791F','#C0392B','#D4527E','#7B2FBE','#1A5276'],
    render: (ctx, x, y, s, color = '#B7791F') => {
      const pts = 8
      ctx.save(); ctx.translate(x, y); ctx.beginPath()
      for (let i = 0; i < pts * 2; i++) {
        const r = i % 2 === 0 ? s * 1.4 : s * 0.55
        const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2
        i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r)
      }
      ctx.closePath(); ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill()
      ctx.restore()
    }
  },
]

// Draws a single vibhuti/ash stripe that bows upward to follow forehead curvature,
// with opacity fading toward the tapered ends.
function drawAshStripe(ctx, cx, cy, w, h, color) {
  const bow = w * 0.055          // upward bow — ~5.5% of width
  const taper = h * 0.9          // horizontal distance for rounded ends
  const x0 = cx - w / 2, x1 = cx + w / 2

  // Parse hex → r,g,b for gradient
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  ctx.save()

  // Curved stripe path (top + bottom edges bow upward identically → parallel arcs)
  ctx.beginPath()
  ctx.moveTo(x0 + taper, cy - h / 2)
  ctx.quadraticCurveTo(cx, cy - h / 2 - bow, x1 - taper, cy - h / 2) // top edge
  ctx.quadraticCurveTo(x1 + taper * 0.4, cy, x1 - taper, cy + h / 2) // right cap
  ctx.quadraticCurveTo(cx, cy + h / 2 - bow, x0 + taper, cy + h / 2) // bottom edge
  ctx.quadraticCurveTo(x0 - taper * 0.4, cy, x0 + taper, cy - h / 2) // left cap
  ctx.closePath()
  ctx.clip()

  // Horizontal gradient: transparent → opaque → opaque → transparent
  const grad = ctx.createLinearGradient(x0, 0, x1, 0)
  grad.addColorStop(0,    `rgba(${r},${g},${b},0)`)
  grad.addColorStop(0.07, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.93, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(1,    `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(x0, cy - h / 2 - bow - 2, w, h + bow + 4)

  ctx.restore()
}

export const TILAKS = [
  {
    id: 'T01', name: 'Tripundra',
    note: 'Three ash lines of Shaiva tradition — Lord Shiva\'s mark, worn across India',
    detail: 'The tripundra (tri = three, pundra = mark) is the defining mark of Shaivites — devotees of Lord Shiva. The three horizontal lines of vibhuti (sacred ash) represent the three sacred fires, the three worlds (earth, sky, heaven), and the burning away of ego, attachment, and karma. Made from ash of burnt dried wood or cow dung from a sacrificial fire, it is applied with three middle fingers in a single sweep across the forehead.',
    regions: 'Pan-India, especially Tamil Nadu, Karnataka, Varanasi',
    occasion: 'Daily (for devoted Shaivites), Shivaratri, temple visits',
    colors: ['#EFEFEA','#D4C5A9','#9CA3AF'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      const lineH = s * 0.52, gap = s * 0.92
      const offsets = [0, gap, gap * 2]
      offsets.forEach((dy, i) => {
        const w = s * (i === 1 ? 10.5 : 9.5)
        drawAshStripe(ctx, x, y - dy - lineH / 2, w, lineH, color)
      })
    }
  },
  {
    id: 'T02', name: 'Tripundra + Dot',
    note: 'Shaivite tripundra with a red kumkum dot — common in Tamil Nadu and Karnataka',
    detail: 'A regional variation of the tripundra where a red kumkum dot is placed in the centre of the middle ash line. The dot represents the bindu — the point of creation, and the divine energy of Shakti. This combined mark acknowledges both Shiva (ash lines) and Shakti (the red dot), and is the standard tilak seen at Shiva temples across South India, particularly in Tamil Nadu and Karnataka.',
    regions: 'Tamil Nadu, Karnataka, Andhra Pradesh',
    occasion: 'Shivaratri, daily for South Indian Shaivites',
    colors: ['#EFEFEA','#D4C5A9'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      const lineH = s * 0.52, gap = s * 0.92
      const offsets = [0, gap, gap * 2]
      offsets.forEach((dy, i) => {
        const w = s * (i === 1 ? 10.5 : 9.5)
        drawAshStripe(ctx, x, y - dy - lineH / 2, w, lineH, color)
      })
      // Red dot sits on the bottom line centre
      ctx.beginPath(); ctx.arc(x, y - lineH / 2, s * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = '#C0392B'; ctx.fill()
    }
  },
  {
    id: 'T03', name: 'Sri Vaishnava Namam',
    note: 'Iyengar tilak — two white prongs representing Vishnu\'s feet, red line for Lakshmi',
    detail: 'The Sri Vaishnava Namam (also called Urdhva Pundra or Srichurnam) is the tilak of Iyengar Brahmins of Tamil Nadu, followers of the Sri Vaishnava tradition of Ramanuja. The two white outer lines (made from white clay) represent the feet of Narayana. The red central line (Srichurnam, made from red turmeric) represents Goddess Lakshmi, through whom devotees approach Narayana. This reflects the core Visishtadvaita philosophy: surrender to Vishnu through Lakshmi.',
    regions: 'Tamil Nadu, Andhra Pradesh (Iyengar communities)',
    occasion: 'Daily (for observant Iyengars), Vaikunta Ekadasi, temple',
    colors: ['#EFEFEA','#D4C5A9'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      // Anchor = base of mark (just above brow). Pillars grow upward.
      const pillarW = s * 0.9, pillarH = s * 5.0, gap = s * 0.55
      ctx.beginPath(); ctx.roundRect(x - gap - pillarW, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x + gap, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x - s*0.22, y - pillarH * 0.92, s*0.44, pillarH * 0.84, s*0.22)
      ctx.fillStyle = '#CC2222'; ctx.fill()
    }
  },
  {
    id: 'T04', name: 'Madhva Tilak',
    note: 'Madhva Vaishnava sampradaya — two Gopichandana lines with a black yajna-ash centre',
    detail: 'The Madhva tilak belongs to the Dvaita Vedanta tradition founded by Madhvacharya in 13th century Karnataka. The two white outer lines are made from Gopichandana — the sacred clay from Gopi Kunda lake in Dwarka, Gujarat. The black centre line is made from the coal ash of the daily yajna fire, representing the wearer\'s presence at the sacrificial fire. This tilak is widely worn by Brahmin communities across Karnataka and Udupi.',
    regions: 'Karnataka, Udupi, Coastal Karnataka',
    occasion: 'Daily (Madhva Brahmins), Udupi Krishna temple festivals',
    colors: ['#EFEFEA','#D4C5A9'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      const pillarW = s * 0.85, pillarH = s * 4.2, gap = s * 0.5
      ctx.beginPath(); ctx.roundRect(x - gap - pillarW, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x + gap, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x - s*0.2, y - pillarH * 0.92, s*0.4, pillarH * 0.84, s*0.2)
      ctx.fillStyle = '#1C1410'; ctx.fill()
    }
  },
  {
    id: 'T05', name: 'Gaudiya / ISKCON',
    note: 'Two Gopichandana lines with a tulsi-leaf arch at the base — Krishna devotion',
    detail: 'The Gaudiya Vaishnava tilak — worn by ISKCON (Hare Krishna) devotees worldwide — uses two Gopichandana clay lines with a small tulsi leaf shape at the base. Unlike other Vaishnava traditions, there is no coloured centre line: the black line representing Radha was replaced with a tulsi leaf, reflecting the Gaudiya emphasis on approaching Krishna through service, as a tulsi leaf offered at His feet. This tilak is now recognised globally.',
    regions: 'Bengal, Vrindavan, Mayapur; worldwide through ISKCON',
    occasion: 'Daily (for initiated devotees), Janmashtami, Ratha Yatra',
    colors: ['#EFEFEA','#D4C5A9'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      const pillarW = s * 0.8, pillarH = s * 4.0, gap = s * 0.5
      ctx.beginPath(); ctx.roundRect(x - gap - pillarW, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x + gap, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      // Tulsi leaf arch at the base joining both pillars
      ctx.save(); ctx.translate(x, y)
      ctx.beginPath()
      ctx.moveTo(-gap - pillarW * 0.5, 0)
      ctx.bezierCurveTo(-gap * 0.3, -s * 1.1, gap * 0.3, -s * 1.1, gap + pillarW * 0.5, 0)
      ctx.strokeStyle = color; ctx.lineWidth = pillarW * 0.85; ctx.lineCap = 'round'
      ctx.stroke(); ctx.restore()
    }
  },
  {
    id: 'T06', name: 'Chandan',
    note: 'Single white/yellow sandalwood line — worn across all traditions at temples',
    detail: 'The chandan (sandalwood) tilak is the most universal mark in Hinduism — applied by priests to devotees at temples across every tradition and region. Made from sandalwood paste (sometimes mixed with camphor, saffron, or turmeric), it has a cooling effect on the ajna chakra and a calming fragrance. It is the default tilak applied when visiting any temple, regardless of the devotee\'s own sect.',
    regions: 'Pan-India, all traditions',
    occasion: 'Temple visits, puja, auspicious ceremonies',
    colors: ['#EDD98A','#EFEFEA','#E8C96A'],
    render: (ctx, x, y, s, color = '#EDD98A') => {
      // Tall, gently tapered vertical mark — anchor point (x,y) is the BASE of the mark
      // so it grows upward from just above the brow line toward the hairline
      const markH = s * 5.5   // tall enough to span eyebrow-to-hairline
      const markW = s * 0.72  // thumb-width, as it's applied with a finger
      ctx.save(); ctx.translate(x, y)
      ctx.beginPath()
      // Slightly wider at bottom, tapers toward top — natural finger-applied shape
      ctx.moveTo(-markW * 0.55, 0)
      ctx.bezierCurveTo(-markW * 0.65, -markH * 0.4, -markW * 0.45, -markH * 0.85, -markW * 0.28, -markH)
      ctx.lineTo(markW * 0.28, -markH)
      ctx.bezierCurveTo(markW * 0.45, -markH * 0.85, markW * 0.65, -markH * 0.4, markW * 0.55, 0)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      // Subtle highlight — paste has a slightly glossy centre
      ctx.beginPath()
      ctx.ellipse(0, -markH * 0.5, markW * 0.18, markH * 0.28, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,230,0.35)'
      ctx.fill()
      ctx.restore()
    }
  },
  {
    id: 'T07', name: 'Shakta Kumkum',
    note: 'Red kumkum mark of Shakta tradition — devotion to Devi, worn across Bengal and beyond',
    detail: 'The Shakta kumkum tilak is the mark of devotees of the Goddess (Devi) in her many forms — Durga, Kali, Lakshmi, Saraswati. Red kumkum (powdered red turmeric) symbolises Shakti — the divine feminine energy and creative power of the universe. It is applied vertically to represent an upward surge of energy through the chakras. In Bengal, it is applied during Durga Puja as part of the sindoor khela ceremony.',
    regions: 'Bengal, Assam, Odisha, Kerala, Maharashtra',
    occasion: 'Durga Puja, Navaratri, Kali Puja, Devi temples',
    colors: ['#CC2222','#B7791F','#8B1A1A'],
    render: (ctx, x, y, s, color = '#CC2222') => {
      ctx.save(); ctx.translate(x, y - s * 0.5)
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.75, s * 1.05, 0, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.ellipse(-s*0.18, -s*0.3, s*0.22, s*0.32, -0.4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,180,160,0.3)'; ctx.fill()
      ctx.restore()
    }
  },
  {
    id: 'T08', name: 'Swaminarayana',
    note: 'Tilak of the Swaminarayana sampradaya — broader U-shape with red centre, popular in Gujarat',
    detail: 'The Swaminarayana tilak belongs to the Swaminarayana Sampraday founded by Sahajanand Swami in early 19th century Gujarat. Its broader, rounder U-shape distinguishes it from the Sri Vaishnava Namam. The red centre line represents the divine presence of Akshar — the eternal abode of God. Widely worn by Gujarati families globally, this tilak is one of the most commonly seen Vaishnava marks outside India, particularly in the UK, USA, and East Africa.',
    regions: 'Gujarat, and Gujarati diaspora worldwide',
    occasion: 'Daily (for followers), BAPS Swaminarayan mandir visits, Diwali',
    colors: ['#EFEFEA','#D4C5A9'],
    render: (ctx, x, y, s, color = '#EFEFEA') => {
      const pillarW = s * 1.1, pillarH = s * 3.8, gap = s * 0.45
      ctx.beginPath(); ctx.roundRect(x - gap - pillarW, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x + gap, y - pillarH, pillarW, pillarH, pillarW/2)
      ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.roundRect(x - s*0.25, y - pillarH * 0.92, s*0.5, pillarH * 0.82, s*0.25)
      ctx.fillStyle = '#CC2222'; ctx.fill()
    }
  },
]
