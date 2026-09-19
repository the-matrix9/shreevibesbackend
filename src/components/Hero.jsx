import React from 'react';

const CATEGORIES = [
  'Trending',
  'Radha Krishna',
  'Nature',
  'Travel',
  'Fashion',
  'Design',
  'Food',
  'Architecture',
  'Art',
  'Wallpaper',
];

export default function Hero({ query, setQuery, onSubmit, activeCategory, onCategoryClick }) {
  return (
    <section className="relative flex flex-col items-center text-center mb-2xl pt-3xl md:pt-3xl overflow-hidden">
      <div className="ambient-orb w-72 h-72 -top-10 -left-10 bg-primary animate-float-slow" />
      <div
        className="ambient-orb w-64 h-64 top-10 right-0 bg-secondary animate-float-slow"
        style={{ animationDelay: '-3s' }}
      />

      <span className="relative font-label-md text-label-sm text-primary dark:text-night-primary bg-primary-container/50 dark:bg-night-primary/10 rounded-full px-4 py-1.5 mb-lg animate-rise-in">
        Free to browse · free API for developers
      </span>

      <h1
        className="relative font-display-lg text-display-lg md:text-[64px] text-on-background dark:text-night-text mb-md animate-rise-in max-w-3xl"
        style={{ animationDelay: '60ms' }}
      >
        Find the image you're picturing.
      </h1>
      <p
        className="relative font-body-lg text-body-lg text-on-surface-variant dark:text-night-muted max-w-2xl mb-xl animate-rise-in"
        style={{ animationDelay: '120ms' }}
      >
        Search any name or theme, browse a curated grid of results, and keep
        the ones you love — full size, one click.
      </p>

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-3xl mb-xl group animate-rise-in"
        style={{ animationDelay: '180ms' }}
      >
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline dark:text-night-muted text-2xl group-focus-within:text-primary dark:group-focus-within:text-night-primary transition-colors">
            search
          </span>
        </div>
        <input
          className="w-full bg-surface-container-low dark:bg-night-surface border border-outline-variant dark:border-night-border rounded-full py-4 pl-16 pr-32 font-body-lg text-body-lg text-on-background dark:text-night-text placeholder:text-outline dark:placeholder:text-night-muted focus:border-primary dark:focus:border-night-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] outline-none"
          placeholder="Try 'Radha Krishna' or 'mountain wallpaper'..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary rounded-full px-6 py-2.5 font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
        >
          Search
        </button>
      </form>

      <div
        className="relative w-full overflow-x-auto hide-scrollbar pb-sm animate-rise-in"
        style={{ animationDelay: '240ms' }}
      >
        <div className="flex gap-sm justify-center min-w-max px-4 md:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={
                'px-4 py-2 rounded-full font-label-md text-label-md transition-colors border ' +
                (activeCategory === cat
                  ? 'bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary border-transparent shadow-sm'
                  : 'bg-surface-container dark:bg-night-surface hover:bg-primary/10 hover:text-primary dark:hover:bg-night-surface-2 dark:hover:text-night-primary text-on-surface-variant dark:text-night-muted border-transparent hover:border-primary/20')
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
