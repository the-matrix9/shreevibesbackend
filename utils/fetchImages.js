const axios = require('axios');

const UPSTREAM_TIMEOUT_MS = 15000;
const DEFAULT_IMAGES = 25;
const MAX_IMAGES = 150;

/**
 * Clamp a user-supplied "how many images" value to something sane.
 * Falls back to DEFAULT_IMAGES for anything missing/invalid.
 */
function clampImages(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return DEFAULT_IMAGES;
  return Math.min(Math.round(num), MAX_IMAGES);
}

/**
 * The upstream `pages` param controls how many internal scrape cycles it's
 * willing to run to reach the requested `images` count. Scale it with the
 * request instead of hardcoding — mirrors the 50 images / 10 pages ratio
 * ShreeVibe already uses in production (roughly 1 page per 5 images),
 * capped at 10 since that's the upstream's own ceiling.
 */
function pagesForImages(images) {
  return Math.min(10, Math.max(1, Math.ceil(images / 5)));
}

/**
 * Strip upstream/Pinterest internals down to exactly what the UI (and
 * public API consumers) need, so we never leak upstream implementation
 * details, tracking params, or the upstream key itself.
 */
function reshapePin(pin) {
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
    width: imgs.orig?.width || imgs['736x']?.width || null,
    height: imgs.orig?.height || imgs['736x']?.height || null,
    author: pin.author?.full_name || pin.author?.username || null,
    likes: pin.engagement?.reactions ?? null,
    mediaType: pin.media_type || 'image',
    sourceUrl: pin.url || null,
  };
}

/**
 * Search the upstream image API and return a clean, deduped, reshaped
 * result set. Shared by the internal site route (/api/search) and the
 * free public route (/api/v1/search) so both stay in sync.
 */
async function searchUpstream(q, { images } = {}) {
  if (!process.env.UPSTREAM_BASE || !process.env.UPSTREAM_KEY) {
    const err = new Error('Search service is not configured');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const imageCount = clampImages(images);
  const pages = pagesForImages(imageCount);

  const upstream = await axios.get(process.env.UPSTREAM_BASE, {
    params: {
      key: process.env.UPSTREAM_KEY,
      search: q,
      images: imageCount,
      pages,
    },
    timeout: UPSTREAM_TIMEOUT_MS,
  });

  const raw = Array.isArray(upstream.data?.data?.pins) ? upstream.data.data.pins : [];

  const seen = new Set();
  const results = raw
    .map(reshapePin)
    .filter(Boolean)
    .filter((img) => {
      if (seen.has(img.id)) return false;
      seen.add(img.id);
      return true;
    });

  const totalImages = upstream.data?.data?.total_images ?? results.length;

  return { results, totalImages, requestedImages: imageCount, requestedPages: pages };
}

module.exports = { searchUpstream, clampImages, pagesForImages, DEFAULT_IMAGES, MAX_IMAGES };
