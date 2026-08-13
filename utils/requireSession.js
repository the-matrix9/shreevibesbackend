const jwt = require('jsonwebtoken');

function requireSession(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Verification required', code: 'NO_SESSION' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.scope !== 'shreevibe-session') throw new Error('bad scope');
    req.session = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Session expired, please verify again', code: 'BAD_SESSION' });
  }
}

module.exports = requireSession;
