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

    const raw = Array.isArray(upstream.data?.data) ? upstream.data.data : [];

    // Reshape + strip anything that isn't needed by the UI (upstream key,
    // tracking params, internal ids) so we never leak upstream internals.
    const results = raw.map((pin) => ({
      id: pin.id,
      title: pin.title || 'Untitled',
      description: (pin.description || '').trim(),
      thumb: pin.image_medium_url,
      large: pin.image_large_url,
      width: pin.image_large_size_pixels?.width,
      height: pin.image_large_size_pixels?.height,
    })).filter((p) => p.thumb && p.large);

    res.json({ query: q, count: results.length, results });
  } catch (err) {
    console.error('Search upstream error:', err.message);
    res.status(502).json({ error: 'Search service is unavailable right now' });
  }
});

module.exports = router;
