const express = require('express');
const rateLimit = require('express-rate-limit');
const requireSession = require('../utils/requireSession');
const { searchUpstream } = require('../utils/fetchImages');

const router = express.Router();

router.use(rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
}));

router.use(requireSession);

router.get('/', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.status(400).json({ error: 'Query is required' });
  if (q.length > 60) return res.status(400).json({ error: 'Query too long' });

  try {
    const { results, totalImages } = await searchUpstream(q, { images: req.query.count });
    res.json({ query: q, count: results.length, total: totalImages, results });
  } catch (err) {
    if (err.code === 'NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Search service is not configured' });
    }
    console.error('Search upstream error:', err.message);
    res.status(502).json({ error: 'Search service is unavailable right now' });
  }
});

module.exports = router;
