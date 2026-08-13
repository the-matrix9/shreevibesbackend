const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { createChallenge, verifyChallenge } = require('../utils/challenge');

const router = express.Router();

const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(verifyLimiter);

// Step 1: browser asks for a challenge
router.get('/challenge', (req, res) => {
  const { id, a, b, difficulty } = createChallenge();
  res.json({ id, a, b, difficulty });
});

// Step 2: browser solves it, gets a short-lived session token
router.post('/solve', (req, res) => {
  const { id, answer, nonce } = req.body || {};
  if (!id || answer === undefined || nonce === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const result = verifyChallenge(id, answer, nonce);
  if (!result.ok) {
    return res.status(403).json({ error: 'Verification failed', reason: result.reason });
  }

  const ttl = Number(process.env.SESSION_TTL_SECONDS || 300);
  const token = jwt.sign(
    { scope: 'shreevibe-session' },
    process.env.JWT_SECRET,
    { expiresIn: ttl }
  );

  res.json({ token, expiresIn: ttl });
});

module.exports = router;
