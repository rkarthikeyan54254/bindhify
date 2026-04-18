# Bindify — Prototype v0.1

A web-based bindi & tilak try-on app. Upload a photo, get a culturally appropriate overlay placed on your forehead.

## How it works

1. User uploads a photo
2. The photo is sent to Claude Vision (Anthropic API) which returns forehead coordinates + gender detection as JSON
3. The bindi or tilak SVG is rendered onto an HTML Canvas at the detected position
4. User can browse styles, adjust size/position, and download or share the result

All processing is client-side except the Claude Vision API call. Photos are never stored.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get an Anthropic API key

Sign up at [console.anthropic.com](https://console.anthropic.com) and create an API key.

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

When the app loads, it will ask for your API key. Enter your `sk-ant-...` key — it is stored only in sessionStorage (cleared when you close the tab) and sent only to the Anthropic API.

### 4. Build for production

```bash
npm run build
```

The `dist/` folder can be deployed to Netlify, Vercel, or any static host.

> ⚠️ **Important:** For a production deployment, move the API key to a server-side proxy so it is never exposed in the browser. The current setup is prototype-only.

---

## Project structure

```
bindify/
├── src/
│   ├── App.jsx                  # Main app — all screens and state
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global styles + design tokens
│   ├── assets/
│   │   └── styles.js            # All bindi & tilak SVG render functions
│   ├── api/
│   │   └── detect.js            # Claude Vision API helper
│   └── components/
│       ├── BindifyCanvas.jsx    # Canvas renderer (photo + overlay)
│       └── StyleCarousel.jsx    # Scrollable style picker
├── index.html
├── vite.config.js
└── package.json
```

---

## Style catalogue

### Bindis (female)
| ID  | Name           | Shape          |
|-----|----------------|----------------|
| B01 | Classic Round  | Circle         |
| B02 | Teardrop       | Oval-drop      |
| B03 | Floral         | 6-petal flower |
| B04 | Bridal Red     | Layered circle |
| B05 | Crystal Stud   | Gem with glow  |
| B06 | Crescent Moon  | Crescent       |
| B07 | Elongated Leaf | Leaf / paisley |
| B08 | Kundan Cluster | Multi-dot gold |

### Tilaks (male)
| ID  | Name           | Tradition            |
|-----|----------------|----------------------|
| T01 | Vibhuti        | Shaivite (3 lines)   |
| T02 | Vaishnava Nama | Sri Vaishnava (U+red)|
| T03 | Chandan        | General (line)       |
| T04 | Kumkum Dot     | General (red dot)    |
| T05 | Gopichandana   | ISKCON (Y-shape)     |

---

## Next steps (Phase 2)

- [ ] Move API key to a server-side proxy (Express / Netlify Function)
- [ ] Add HEIC support (heic2any library)
- [ ] Replace SVG placeholders with real illustrated bindi/tilak assets
- [ ] Add live camera support (real-time AR via MediaPipe)
- [ ] Deploy to bindify.com / bindify.app
