// Calls Claude vision API to detect face landmarks and gender from an uploaded photo.
// Returns: { gender: 'female'|'male'|'unknown', forehead: { x, y, confidence }, faceBox: { x, y, w, h } }
// All coordinates are normalised 0–1 relative to image width/height.

const SYSTEM_PROMPT = `You are a face analysis API. When given a photo of a person, you must respond ONLY with a valid JSON object — no explanation, no markdown, no preamble.

Analyse the image and return:
{
  "gender": "female" | "male" | "unknown",
  "faceDetected": true | false,
  "faceBox": {
    "xCenter": 0.0–1.0,
    "yCenter": 0.0–1.0,
    "width": 0.0–1.0,
    "height": 0.0–1.0
  },
  "forehead": {
    "x": 0.0–1.0,
    "y": 0.0–1.0,
    "confidence": 0.0–1.0
  }
}

Rules:
- All coordinates are normalised: 0.0 = left/top edge, 1.0 = right/bottom edge.
- forehead.x/y is the centre point of the forehead where a bindi or tilak would be placed — between the eyebrows and the hairline, horizontally centred on the face.
- If no face is detected, set faceDetected to false and set all numeric values to 0.
- Do not include any text outside the JSON object.`

const GENDER_PROMPT = `You are a gender detection API. Look at the person in the photo and respond ONLY with a valid JSON object — no explanation, no markdown, no preamble.

Return exactly:
{ "gender": "female" | "male" | "unknown" }

Base your answer on visual cues like facial features, hair, and overall appearance. If uncertain, use "unknown".`

// Calls the Netlify serverless proxy — API key never touches the browser
export async function detectGender(imageBase64, mimeType = 'image/jpeg') {
  try {
    const response = await fetch('/api/detect-gender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: imageBase64, mimeType }),
    })
    if (!response.ok) return 'unknown'
    const { gender } = await response.json()
    return gender || 'unknown'
  } catch {
    return 'unknown'
  }
}

export async function detectForehead(imageBase64, mimeType = 'image/jpeg') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 }
            },
            { type: 'text', text: 'Analyse this photo and return the JSON.' }
          ]
        }
      ]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.content?.find(b => b.type === 'text')?.text || ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse face detection response: ' + text)
  }
}
