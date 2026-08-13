const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const requireSession = require('../utils/requireSession');

const router = express.Router();

router.use(rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
}));

router.use(requireSession);

const ALLOWED_HOSTS = new Set(['i.pinimg.com']);

router.get('/', async (req, res) => {
  const { url, name } = req.query;
  if (!url) return res.status(400).json({ error: 'url is required' });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }

  // Only ever allow re-fetching images from the known trusted CDN host.
  // This stops the download endpoint being abused as an open proxy/SSRF vector.
  if (!ALLOWED_HOSTS.has(parsed.hostname) || parsed.protocol !== 'https:') {
    return res.status(400).json({ error: 'URL host not allowed' });
  }

  try {
    const upstream = await axios.get(parsed.toString(), {
      responseType: 'stream',
      timeout: 15000,
    });

    const safeName = (name ? String(name) : 'shreevibe-image')
      .replace(/[^a-z0-9\-_\s]/gi, '')
      .trim()
      .slice(0, 60) || 'shreevibe-image';

    res.setHeader('Content-Type', upstream.headers['content-type'] || 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.jpg"`);
    upstream.data.pipe(res);
  } catch (err) {
    console.error('Download proxy error:', err.message);
    res.status(502).json({ error: 'Could not fetch image' });
  }
});

module.exports = router;
