const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Exposed for the /api docs page so its code samples always point at the
// backend this build was actually configured with.
export const API_BASE = BASE;

let sessionToken = null;
let tokenExpiresAt = 0;

async function sha256Hex(input) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function solveChallenge(id, difficulty) {
  // Tiny client-side proof-of-work: find a nonce whose hash has N leading zeros.
  let nonce = 0;
  const prefix = '0'.repeat(difficulty);
  // Safety cap so this can never hang the browser tab.
  for (let i = 0; i < 2_000_000; i += 1) {
    const hash = await sha256Hex(`${id}:${nonce}`);
    if (hash.startsWith(prefix)) return nonce;
    nonce += 1;
  }
  throw new Error('Could not solve verification challenge');
}

async function verifyHuman() {
  const chalRes = await fetch(`${BASE}/api/verify/challenge`, {
    headers: { 'X-ShreeVibe-Client': 'shreevibe-web' },
  });
  if (!chalRes.ok) throw new Error('Could not start verification');
  const { id, a, b, difficulty } = await chalRes.json();

  const nonce = await solveChallenge(id, difficulty);

  const solveRes = await fetch(`${BASE}/api/verify/solve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ShreeVibe-Client': 'shreevibe-web',
    },
    body: JSON.stringify({ id, answer: a + b, nonce }),
  });
  if (!solveRes.ok) throw new Error('Verification failed');
  const { token, expiresIn } = await solveRes.json();
  sessionToken = token;
  tokenExpiresAt = Date.now() + expiresIn * 1000 - 5000;
  return token;
}

async function ensureSession() {
  if (sessionToken && Date.now() < tokenExpiresAt) return sessionToken;
  return verifyHuman();
}

async function authedFetch(path, opts = {}) {
  const token = await ensureSession();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      Authorization: `Bearer ${token}`,
      'X-ShreeVibe-Client': 'shreevibe-web',
    },
  });

  if (res.status === 401) {
    // Session lapsed mid-flight — re-verify once and retry.
    sessionToken = null;
    const fresh = await ensureSession();
    return fetch(`${BASE}${path}`, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: `Bearer ${fresh}`,
        'X-ShreeVibe-Client': 'shreevibe-web',
      },
    });
  }
  return res;
}

export async function searchImages(query, { count } = {}) {
  const params = new URLSearchParams({ q: query });
  if (count) params.set('count', String(count));
  const res = await authedFetch(`/api/search?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Search failed');
  }
  return res.json();
}

export function downloadImageUrl(largeUrl, name) {
  return ensureSession().then((token) => {
    const params = new URLSearchParams({ url: largeUrl, name: name || 'shreevibe-image' });
    return { url: `${BASE}/api/download?${params.toString()}`, token };
  });
}

export async function triggerDownload(largeUrl, name) {
  const token = await ensureSession();
  const params = new URLSearchParams({ url: largeUrl, name: name || 'shreevibe-image' });
  const res = await fetch(`${BASE}/api/download?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-ShreeVibe-Client': 'shreevibe-web',
    },
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = `${(name || 'shreevibe-image').replace(/[^a-z0-9\-_\s]/gi, '')}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
