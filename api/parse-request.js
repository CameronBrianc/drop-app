// Vercel Serverless Function: POST /api/parse-request
// Calls the real Anthropic API to parse a plain-English request into a
// structured watch rule. Requires ANTHROPIC_API_KEY as an env var.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server not configured: missing ANTHROPIC_API_KEY' });

  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: 'Request text is required' });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Extract a structured purchase-watch rule from this shopper request. ` +
            `Respond with ONLY JSON, no other text: {"item": short product/event name, "retailer": string, "maxPrice": number as string (use "?" if genuinely not stated), "qty": number as string (default "1" if not stated — do NOT use unrelated numbers like a model year or "Nth anniversary" as quantity), "resale": "On" or "Off"}. ` +
            `Request: """${text}"""`
        }]
      })
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: 'Claude API request failed', detail });
    }
    const data = await resp.json();
    const raw = (data.content || []).map(b => b.text || '').join('').trim();
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to parse response', detail: String(err) });
  }
};
