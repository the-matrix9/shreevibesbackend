import React, { useState } from 'react';

const CATEGORIES = [
  { label: 'Radha Krishna', query: 'radha krishna', emoji: '🪈' },
  { label: 'Nature', query: 'nature wallpaper', emoji: '🌿' },
  { label: 'Travel', query: 'travel destinations', emoji: '✈️' },
  { label: 'Fashion', query: 'fashion editorial', emoji: '👗' },
  { label: 'Architecture', query: 'modern architecture', emoji: '🏛️' },
  { label: 'Food', query: 'food photography', emoji: '🍽️' },
  { label: 'Art', query: 'digital art', emoji: '🎨' },
  { label: 'Technology', query: 'technology', emoji: '💻' },
  { label: 'Design', query: 'minimal design', emoji: '✏️' },
  { label: 'Wallpaper', query: 'aesthetic wallpaper', emoji: '🖼️' },
  { label: 'Portraits', query: 'portrait photography', emoji: '📸' },
  { label: 'Quotes', query: 'motivational quotes', emoji: '💬' },
];

export default function ExploreView({ onCategoryClick }) {
  const [customValue, setCustomValue] = useState('');

  return (
    <section className="pb-3xl fade-in-up">
      <header className="mb-xl text-center md:text-left">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background dark:text-night-text mb-sm">
          Explore
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-night-muted">
          Pick a category to pull in a fresh set of images.
        </p>
      </header>

      <div className="mb-xl max-w-xl mx-auto md:mx-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customValue.trim()) onCategoryClick(customValue.trim());
          }}
          className="relative"
        >
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-night-muted text-xl">
            search
          </span>
          <input
            className="w-full bg-surface-container-low dark:bg-night-surface border border-outline-variant dark:border-night-border rounded-full py-3 pl-12 pr-4 text-on-background dark:text-night-text placeholder:text-outline dark:placeholder:text-night-muted focus:border-primary dark:focus:border-night-primary outline-none transition-all"
            placeholder="Or search something specific…"
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
          />
        </form>
      </div>

      <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-lg flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary dark:text-night-primary">category</span>
        Popular Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => onCategoryClick(cat.query)}
            className="gallery-enter group cursor-pointer rounded-[18px] overflow-hidden relative aspect-square border border-outline-variant/30 dark:border-night-border bg-surface-container dark:bg-night-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center justify-center gap-2"
            style={{ '--stagger': i }}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
            <span className="font-label-md text-label-md text-on-surface dark:text-night-text font-bold tracking-wide">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
