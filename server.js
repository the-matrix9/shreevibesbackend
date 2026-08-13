require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Fail-safe: if someone forgets to create .env / set JWT_SECRET, don't crash
// on the first request — generate a random one for this process instead and
// warn loudly. Sessions just won't survive a restart until a real .env exists.
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn(
    '\n[ShreeVibe] WARNING: JWT_SECRET is not set (no .env found?). ' +
    'Using a temporary random secret for this run only.\n' +
    'Run "cp .env.example .env" in /backend and set a real JWT_SECRET before deploying.\n'
  );
}
if (!process.env.UPSTREAM_BASE || !process.env.UPSTREAM_KEY) {
  console.warn(
    '\n[ShreeVibe] WARNING: UPSTREAM_BASE / UPSTREAM_KEY are not set. ' +
    'Copy backend/.env.example to backend/.env and fill them in, or /api/search will fail.\n'
  );
}

const verifyRoutes = require('./routes/verify');
const searchRoutes = require('./routes/search');
const downloadRoutes = require('./routes/download');

const app = express();

// ---- Core hardening ----
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(express.json({ limit: '10kb' }));

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-ShreeVibe-Client'],
}));

// Block anything that doesn't look like it came from our own frontend fetch code.
// This is not bulletproof (nothing client-side ever is) but it filters out
// casual scraping / direct curl attempts and forces attackers to at least
// replicate our token handshake.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const marker = req.get('X-ShreeVibe-Client');
    if (marker !== 'shreevibe-web') {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  next();
});

// Global rate limit
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' },
}));

app.use('/api/verify', verifyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/download', downloadRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ShreeVibe backend running on port ${PORT}`));
