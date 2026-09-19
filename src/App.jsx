import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import MasonryGallery from './components/MasonryGallery.jsx';
import ExploreView from './components/ExploreView.jsx';
import SavedView from './components/SavedView.jsx';
import ApiPage from './components/ApiPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import Footer from './components/Footer.jsx';
import Lightbox from './components/Lightbox.jsx';
import BackgroundVideo from './components/BackgroundVideo.jsx';
import SkeletonGrid from './components/Skeleton.jsx';
import { searchImages } from './api.js';
import { getInitialTheme, persistTheme } from './theme.js';

const SAVED_KEY = 'shreevibe-saved';
const PAGE_SIZE = 30;
const MAX_COUNT = 150;

function dedupeById(list) {
  const seen = new Set();
  return list.filter((img) => {
    if (seen.has(img.id)) return false;
    seen.add(img.id);
    return true;
  });
}

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'explore' | 'saved' | 'api'
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [images, setImages] = useState([]);
  const [resultTotal, setResultTotal] = useState(0);
  const [requestedCount, setRequestedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [active, setActive] = useState(null);
  const [dark, setDark] = useState(getInitialTheme);

  // Saved images persist across reloads; liked is session-only.
  const [savedMap, setSavedMap] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Map(arr.map((img) => [img.id, img]));
    } catch {
      return new Map();
    }
  });
  const [likedIds, setLikedIds] = useState(() => new Set());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    persistTheme(dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(savedMap.values())));
  }, [savedMap]);

  const runSearch = async (q) => {
    const term = q.trim();
    if (!term) return;
    setView('home');
    setLoading(true);
    setError('');
    setSearched(true);
    setExhausted(false);
    setRequestedCount(PAGE_SIZE);
    try {
      const data = await searchImages(term, { count: PAGE_SIZE });
      const deduped = dedupeById(data.results || []);
      setImages(deduped);
      setResultTotal(data.total ?? deduped.length);
      if (deduped.length < PAGE_SIZE) setExhausted(true);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setImages([]);
      setResultTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || loading || exhausted) return;
    const nextCount = Math.min(requestedCount + PAGE_SIZE, MAX_COUNT);
    setLoadingMore(true);
    setError('');
    try {
      const data = await searchImages(query, { count: nextCount });
      const deduped = dedupeById(data.results || []);
      setResultTotal(data.total ?? deduped.length);
      setRequestedCount(nextCount);
      if (deduped.length <= images.length || nextCount >= MAX_COUNT) {
        setExhausted(true);
      }
      setImages(deduped);
    } catch (e) {
      setError(e.message || 'Could not load more images right now.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = (e, overrideValue) => {
    e.preventDefault();
    const term = overrideValue !== undefined ? overrideValue : query;
    setActiveCategory('');
    setQuery(term);
    runSearch(term);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setQuery(cat);
    runSearch(cat);
  };

  const toggleSave = (image) => {
    setSavedMap((prev) => {
      const next = new Map(prev);
      if (next.has(image.id)) next.delete(image.id);
      else next.set(image.id, image);
      return next;
    });
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goHome = () => setView('home');

  return (
    <div className="text-on-surface dark:text-night-text font-body-md min-h-screen pt-20 pb-28 md:pb-16 transition-colors duration-300">
      <BackgroundVideo />

      <Navbar
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        view={view}
        onNavigate={setView}
      />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 md:pt-8">
        {view === 'home' && (
          <div className="view-transition">
            <Hero
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />

            {error && (
              <div className="max-w-2xl mx-auto mb-lg bg-error-container dark:bg-night-surface-2 text-on-error-container dark:text-night-text rounded-xl px-md py-sm text-sm text-center animate-rise-in">
                {error}
              </div>
            )}

            {loading && (
              <>
                <div className="flex items-center justify-center gap-2 pb-md pt-2 text-on-surface-variant dark:text-night-muted animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-night-primary animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-night-primary animate-bounce [animation-delay:-0.1s]" />
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-night-primary animate-bounce" />
                  <span className="ml-2 font-label-md text-label-md">Loading your vibe…</span>
                </div>
                <SkeletonGrid count={PAGE_SIZE} />
              </>
            )}

            {!loading && searched && images.length === 0 && !error && (
              <div className="text-center py-3xl text-on-surface-variant dark:text-night-muted">
                <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-sm">
                  No results for "{query}"
                </h2>
                <p>Try a different name or a broader theme.</p>
              </div>
            )}

            {!loading && images.length > 0 && (
              <>
                <div className="text-center md:text-left mb-md font-label-md text-label-md text-on-surface-variant dark:text-night-muted">
                  Showing {images.length} results for &ldquo;{query}&rdquo;
                </div>
                <MasonryGallery
                  images={images}
                  onOpen={setActive}
                  savedMap={savedMap}
                  likedIds={likedIds}
                  onToggleSave={toggleSave}
                  onToggleLike={toggleLike}
                />

                {loadingMore && <SkeletonGrid count={Math.min(PAGE_SIZE, MAX_COUNT - images.length) || 6} />}

                {!exhausted && (
                  <div className="flex justify-center pb-2xl animate-rise-in">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 bg-surface-container dark:bg-night-surface border border-outline-variant/40 dark:border-night-border text-on-surface dark:text-night-text rounded-full px-7 py-3 font-label-md text-label-md hover:border-primary hover:text-primary dark:hover:border-night-primary dark:hover:text-night-primary hover:-translate-y-0.5 hover:shadow-md active:scale-95 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 shadow-sm"
                    >
                      <span className={'material-symbols-outlined text-[18px]' + (loadingMore ? ' animate-spin' : '')}>
                        {loadingMore ? 'progress_activity' : 'add_photo_alternate'}
                      </span>
                      {loadingMore ? 'Fetching more…' : 'Show more'}
                    </button>
                  </div>
                )}

                {exhausted && images.length > 0 && (
                  <p className="text-center pb-2xl font-label-sm text-label-sm text-on-surface-variant dark:text-night-muted">
                    That's every result we could find for &ldquo;{query}&rdquo;.
                  </p>
                )}
              </>
            )}

            {!searched && !loading && (
              <div className="text-center py-3xl text-on-surface-variant dark:text-night-muted animate-rise-in">
                <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-night-border mb-md inline-block">
                  photo_library
                </span>
                <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-sm">
                  Your gallery is waiting
                </h2>
                <p>Search above or pick a category to pull in results.</p>
              </div>
            )}
          </div>
        )}

        {view === 'explore' && (
          <div className="view-transition">
            <ExploreView onCategoryClick={handleCategoryClick} onSearch={(q) => { setQuery(q); runSearch(q); }} />
          </div>
        )}

        {view === 'saved' && (
          <div className="view-transition">
            <SavedView
              savedMap={savedMap}
              likedIds={likedIds}
              onOpen={setActive}
              onToggleSave={toggleSave}
              onToggleLike={toggleLike}
              onBrowse={goHome}
            />
          </div>
        )}

        {view === 'api' && (
          <div className="view-transition">
            <ApiPage />
          </div>
        )}
      </main>

      <Footer onNavigate={setView} />
      <BottomNav view={view} onNavigate={setView} />
      <Lightbox image={active} onClose={() => setActive(null)} />
    </div>
  );
}
