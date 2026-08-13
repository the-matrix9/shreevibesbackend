const crypto = require('crypto');

// In-memory challenge store. Fine for a single-instance deployment;
// swap for Redis if you scale out horizontally.
const challenges = new Map();

const CHALLENGE_TTL_MS = 2 * 60 * 1000;

function cleanup() {
  const now = Date.now();
  for (const [id, c] of challenges) {
    if (c.expiresAt < now) challenges.delete(id);
  }
}
setInterval(cleanup, 60 * 1000).unref();

/**
 * Creates a lightweight proof-of-work + arithmetic challenge.
 * The client must find a nonce so that sha256(id + ":" + nonce) starts
 * with `difficulty` zero hex chars, AND answer the simple sum.
 * This costs a real browser a fraction of a second, but makes naive
 * bulk-scraping scripts pay a small CPU tax per request.
 */
function createChallenge() {
  const id = crypto.randomBytes(16).toString('hex');
  const a = crypto.randomInt(1, 20);
  const b = crypto.randomInt(1, 20);
  const difficulty = 3; // leading hex zeros required
  challenges.set(id, {
    answer: a + b,
    difficulty,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
    solved: false,
  });
  return { id, a, b, difficulty };
}

function verifyChallenge(id, answer, nonce) {
  const c = challenges.get(id);
  if (!c) return { ok: false, reason: 'expired_or_unknown' };
  if (c.solved) return { ok: false, reason: 'already_used' };
  if (c.expiresAt < Date.now()) {
    challenges.delete(id);
    return { ok: false, reason: 'expired' };
  }
  if (Number(answer) !== c.answer) {
    return { ok: false, reason: 'wrong_answer' };
  }
  const hash = crypto.createHash('sha256').update(`${id}:${nonce}`).digest('hex');
  if (!hash.startsWith('0'.repeat(c.difficulty))) {
    return { ok: false, reason: 'bad_pow' };
  }
  c.solved = true;
  challenges.delete(id);
  return { ok: true };
}

module.exports = { createChallenge, verifyChallenge };
