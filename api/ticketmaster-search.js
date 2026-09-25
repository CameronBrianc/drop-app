// Vercel Serverless Function: GET /api/ticketmaster-search?keyword=...
// Real event search via Ticketmaster's public Discovery API (read-only,
// no purchasing). Requires a free TICKETMASTER_API_KEY from
// developer.ticketmaster.com.
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server not configured: missing TICKETMASTER_API_KEY' });

  const keyword = (req.query.keyword || '').trim();
  if (!keyword) return res.status(400).json({ error: 'A search keyword is required' });

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(keyword)}&size=8&sort=date,asc&apikey=${API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: 'Ticketmaster request failed', detail });
    }
    const data = await resp.json();
    const events = (data._embedded?.events || []).map(e => {
      const venue = e._embedded?.venues?.[0];
      const priceRange = e.priceRanges?.[0];
      return {
        id: e.id,
        name: e.name,
        venue: venue ? venue.name : 'Venue TBD',
        city: venue?.city?.name || '',
        eventDate: e.dates?.start?.localDate || null,
        eventTime: e.dates?.start?.localTime || null,
        onsaleStatus: e.dates?.status?.code || 'unknown', // e.g. 'onsale', 'offsale', 'cancelled'
        onsaleStart: e.sales?.public?.startDateTime || null,
        priceMin: priceRange ? priceRange.min : null,
        priceMax: priceRange ? priceRange.max : null,
        url: e.url
      };
    });
    return res.status(200).json({ events });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Ticketmaster', detail: String(err) });
  }
};
