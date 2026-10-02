const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Netlify.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const contents = messages
      .filter(m => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .slice(-20)
      .map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, 4000) }] }));

    if (!contents.length || contents[contents.length - 1].role !== 'user') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'A user message is required.' }) };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'You are Nova AI, a helpful and friendly assistant. Answer clearly and directly. If the user writes in Hindi or Hinglish, respond naturally in Hindi or Hinglish.' }]
        },
        contents,
        generationConfig: { maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || `Gemini API returned HTTP ${response.status}`;
      return { statusCode: 502, headers, body: JSON.stringify({ error: message }) };
    }

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || '')
      .join('')
      .trim();

    if (!text) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Gemini returned an empty response.' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ text }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Unable to contact Gemini right now.' }) };
  }
};
