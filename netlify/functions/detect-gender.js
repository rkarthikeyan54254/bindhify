exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const headers = { 'Content-Type': 'application/json' }

  try {
    const { base64, mimeType } = JSON.parse(event.body)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        system: 'Respond ONLY with a JSON object: { "gender": "female" | "male" | "unknown" }. Base your answer on the person\'s visible facial features and appearance.',
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
            { type: 'text', text: 'Return gender JSON.' }
          ]
        }]
      })
    })

    if (!response.ok) {
      // Don't expose upstream errors — just return unknown so the app still works
      return { statusCode: 200, headers, body: JSON.stringify({ gender: 'unknown' }) }
    }

    const data = await response.json()
    const text = data.content?.find(b => b.type === 'text')?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const { gender } = JSON.parse(clean)

    return { statusCode: 200, headers, body: JSON.stringify({ gender: gender || 'unknown' }) }

  } catch {
    // Silently fall back — the user can toggle gender manually
    return { statusCode: 200, headers, body: JSON.stringify({ gender: 'unknown' }) }
  }
}
