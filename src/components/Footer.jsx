import React from 'react';

export default function Footer({ onNavigate }) {
  const go = (view) => (e) => {
    e.preventDefault();
    onNavigate?.(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-3xl bg-surface-container-lowest dark:bg-night-surface border-t border-outline-variant/10 dark:border-night-border hidden md:block">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg px-margin-desktop max-w-container-max mx-auto">
        <div>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-night-primary block mb-md">
            ShreeVibe
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-night-muted">
            Search, save, and vibe — with a free public API behind it.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 dark:text-night-muted/70 uppercase mb-1">
            Browse
          </span>
          <a className="text-on-surface-variant dark:text-night-muted hover:text-primary dark:hover:text-night-primary transition-colors font-label-md text-label-md" href="#" onClick={go('home')}>
            Home
          </a>
          <a className="text-on-surface-variant dark:text-night-muted hover:text-primary dark:hover:text-night-primary transition-colors font-label-md text-label-md" href="#" onClick={go('explore')}>
            Explore
          </a>
          <a className="text-on-surface-variant dark:text-night-muted hover:text-primary dark:hover:text-night-primary transition-colors font-label-md text-label-md" href="#" onClick={go('saved')}>
            Saved
          </a>
        </div>
        <div className="flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 dark:text-night-muted/70 uppercase mb-1">
            Developers
          </span>
          <a className="text-primary dark:text-night-primary font-label-md text-label-md hover:opacity-80 transition-opacity flex items-center gap-1" href="#" onClick={go('api')}>
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            Free API docs
          </a>
        </div>
        <div className="flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant/70 dark:text-night-muted/70 uppercase mb-1">
            ShreeVibe
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-night-muted">
            © {new Date().getFullYear()} ShreeVibe. Built for effortless inspiration.
          </p>
        </div>
      </div>
    </footer>
  );
}
