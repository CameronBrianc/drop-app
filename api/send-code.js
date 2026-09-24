// Vercel Serverless Function: POST /api/send-code
// Generates a 6-digit code, emails it via Resend, and returns a signed,
// stateless token (email + code + expiry, HMAC-signed) — no database needed.
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SECRET = process.env.EMAIL_SECRET;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!SECRET || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server not configured: missing EMAIL_SECRET or RESEND_API_KEY env vars' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${email}:${code}:${expires}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${sig}`).toString('base64');

  try {
    const emailResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Drop <onboarding@resend.dev>',
        to: email,
        subject: 'Your Drop verification code',
        html: `<p style="font-family:sans-serif;font-size:15px;">Your Drop verification code is:</p>
               <p style="font-family:sans-serif;font-size:28px;font-weight:700;letter-spacing:4px;">${code}</p>
               <p style="font-family:sans-serif;font-size:13px;color:#666;">This code expires in 10 minutes.</p>`
      })
    });

    if (!emailResp.ok) {
      const detail = await emailResp.text();
      return res.status(502).json({ error: 'Email provider rejected the request', detail });
    }
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach email provider', detail: String(err) });
  }

  return res.status(200).json({ token });
};
