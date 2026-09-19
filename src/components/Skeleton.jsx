import React from 'react';

// A spread of aspect ratios so the skeleton grid reads like a real masonry
// layout (uniform boxes look obviously fake) instead of one flat rhythm.
const RATIOS = ['3 / 4', '1 / 1', '4 / 5', '2 / 3', '5 / 6', '4 / 3', '3 / 5', '1 / 1'];

export function SkeletonCard({ index = 0 }) {
  return (
    <div
      className="masonry-item rounded-[18px] overflow-hidden bg-surface-container dark:bg-night-surface border border-outline-variant/10 dark:border-night-border animate-rise-in"
      style={{ '--stagger': index % 12 }}
    >
      <div
        className="skeleton-shimmer animate-shimmer w-full"
        style={{ aspectRatio: RATIOS[index % RATIOS.length] }}
      />
      <div className="p-md flex flex-col gap-2">
        <div className="skeleton-line h-3 w-3/4 animate-skeleton-pulse" />
        <div className="skeleton-line h-2.5 w-1/2 animate-skeleton-pulse" style={{ animationDelay: '150ms' }} />
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 12, className = '' }) {
  return (
    <section className={'masonry-grid pb-lg ' + className} aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </section>
  );
}
