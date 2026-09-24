// Vercel Serverless Function: POST /api/verify-code
// Verifies the entered code against the signed token from /api/send-code.
const crypto = require('crypto');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SECRET = process.env.EMAIL_SECRET;
  if (!SECRET) return res.status(500).json({ error: 'Server not configured: missing EMAIL_SECRET' });

  const { token, code, email } = req.body || {};
  if (!token || !code || !email) return res.status(400).json({ error: 'Missing token, code, or email' });

  let decoded;
  try {
    decoded = Buffer.from(token, 'base64').toString('utf8');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  const parts = decoded.split(':');
  if (parts.length !== 4) return res.status(400).json({ error: 'Invalid token' });
  const [tEmail, tCode, tExpires, sig] = parts;

  const expectedSig = crypto.createHmac('sha256', SECRET).update(`${tEmail}:${tCode}:${tExpires}`).digest('hex');
  if (sig !== expectedSig) return res.status(400).json({ error: 'Invalid token' });
  if (Date.now() > Number(tExpires)) return res.status(400).json({ error: 'Code expired — request a new one' });
  if (tEmail !== email) return res.status(400).json({ error: 'Email does not match this token' });
  if (tCode !== code) return res.status(400).json({ error: 'Incorrect code' });

  return res.status(200).json({ verified: true });
};
