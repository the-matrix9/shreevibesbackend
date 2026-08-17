const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const requireSession = require('../utils/requireSession');

const router = express.Router();

router.use(rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
}));

router.use(requireSession);

router.get('/', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.status(400).json({ error: 'Query is required' });
  if (q.length > 60) return res.status(400).json({ error: 'Query too long' });

  try {
    const upstream = await axios.get(process.env.UPSTREAM_BASE, {
      params: { key: process.env.UPSTREAM_KEY, search: q },
      timeout: 10000,
    });

    const raw = Array.isArray(upstream.data?.data?.pins) ? upstream.data.data.pins : [];

    // Reshape + strip anything that isn't needed by the UI (upstream key,
    // author/board internals, tracking params) so we never leak upstream internals.
    const results = raw
      .map((pin) => {
        const imgs = pin.images || {};
        const thumb = imgs['474x']?.url || imgs['236x']?.url || imgs['170x']?.url;
        const large = imgs.orig?.url || imgs['736x']?.url || thumb;
        if (!thumb || !large) return null;

        return {
          id: pin.id,
          title: pin.title || pin.description || 'Untitled',
          description: (pin.description || '').trim(),
          thumb,
          large,
          width: imgs.orig?.width || imgs['736x']?.width,
          height: imgs.orig?.height || imgs['736x']?.height,
          author: pin.author?.full_name || pin.author?.username || null,
          likes: pin.engagement?.reactions ?? null,
        };
      })
      .filter(Boolean);

    res.json({ query: q, count: results.length, results });
  } catch (err) {
    console.error('Search upstream error:', err.message);
    res.status(502).json({ error: 'Search service is unavailable right now' });
  }
});

module.exports = router;
