import React from 'react';
import MasonryGallery from './MasonryGallery.jsx';

export default function SavedView({ savedMap, likedIds, onOpen, onToggleSave, onToggleLike, onBrowse }) {
  const images = Array.from(savedMap.values());

  return (
    <section className="pb-3xl fade-in-up">
      <header className="mb-xl text-center md:text-left">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background dark:text-night-text mb-sm">
          Saved
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-night-muted">
          {images.length ? `${images.length} image${images.length === 1 ? '' : 's'} saved on this device.` : 'Nothing saved yet.'}
        </p>
      </header>

      {images.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant dark:text-night-muted">
          <span className="material-symbols-outlined text-5xl text-outline-variant dark:text-night-border mb-md inline-block">
            bookmark
          </span>
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-sm">
            No saved images yet
          </h2>
          <p className="mb-lg">Tap the bookmark icon on any image to keep it here.</p>
          <button
            onClick={onBrowse}
            className="bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary rounded-full px-6 py-3 font-label-md text-label-md hover:opacity-90 transition-opacity"
          >
            Browse images
          </button>
        </div>
      ) : (
        <MasonryGallery
          images={images}
          onOpen={onOpen}
          savedMap={savedMap}
          likedIds={likedIds}
          onToggleSave={onToggleSave}
          onToggleLike={onToggleLike}
        />
      )}
    </section>
  );
}
