const express = require('express');
const rateLimit = require('express-rate-limit');
const { searchUpstream, DEFAULT_IMAGES, MAX_IMAGES } = require('../utils/fetchImages');

const router = express.Router();

const RATE_LIMIT_PER_MIN = Number(process.env.PUBLIC_API_RATE_LIMIT || 30);

router.use(rateLimit({
  windowMs: 60 * 1000,
  max: RATE_LIMIT_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: `Rate limit exceeded — max ${RATE_LIMIT_PER_MIN} requests per minute per IP. Try again shortly.`,
  },
}));

// Self-documenting root — GET /api/v1
router.get('/', (req, res) => {
  res.json({
    name: 'ShreeVibe Public Image Search API',
    free: true,
    authentication: 'none — open to everyone',
    rateLimit: `${RATE_LIMIT_PER_MIN} requests / minute / IP`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/search',
        description: 'Search for images by keyword.',
        query: {
          q: 'required — search term, e.g. "radha krishna"',
          count: `optional — number of images to return (default ${DEFAULT_IMAGES}, max ${MAX_IMAGES})`,
        },
        example: '/api/v1/search?q=nature&count=30',
      },
    ],
    docs: 'See the /api page on the ShreeVibe website for full documentation and code samples.',
  });
});

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) {
    return res.status(400).json({ error: 'q is required', example: '/api/v1/search?q=nature' });
  }
  if (q.length > 60) {
    return res.status(400).json({ error: 'q is too long (max 60 characters)' });
  }

  try {
    const { results, totalImages, requestedImages } = await searchUpstream(q, {
      images: req.query.count,
    });
    res.json({
      query: q,
      count: results.length,
      total: totalImages,
      requested: requestedImages,
      results,
    });
  } catch (err) {
    if (err.code === 'NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Search service is not configured' });
    }
    console.error('Public search upstream error:', err.message);
    res.status(502).json({ error: 'Search service is unavailable right now' });
  }
});

router.use((req, res) => {
  res.status(404).json({ error: 'Not found', hint: 'See GET /api/v1 for available endpoints' });
});

module.exports = router;
