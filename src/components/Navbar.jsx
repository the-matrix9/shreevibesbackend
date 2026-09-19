import React, { useEffect, useRef, useState } from 'react';
import useScrollDirection from '../hooks/useScrollDirection.js';

const LINKS = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'saved', label: 'Saved' },
  { key: 'api', label: 'API' },
];

export default function Navbar({ query, setQuery, onSubmit, dark, onToggleDark, view, onNavigate }) {
  const [mobileValue, setMobileValue] = useState(query);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navHidden = useScrollDirection();

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      {/* Desktop — floating circular glass pill. Hides on scroll-down, returns on scroll-up. */}
      <div
        className={
          'nav-autohide fixed top-4 left-0 w-full z-50 hidden md:flex justify-center px-margin-desktop pointer-events-none ' +
          (navHidden ? 'nav-hidden' : '')
        }
      >
        <header className="nav-pill pointer-events-auto rounded-full pl-2 pr-2 py-2 flex items-center gap-1 animate-pop-in">
          <button
            className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary dark:from-night-primary dark:to-secondary-container flex items-center justify-center text-on-primary dark:text-night-on-primary font-headline-md font-bold text-lg mr-1 transition-transform hover:scale-105"
            onClick={() => onNavigate('home')}
            aria-label="ShreeVibe home"
          >
            S
          </button>

          <nav className="flex items-center gap-1">
            {LINKS.map((link) => {
              const activeState = view === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => onNavigate(link.key)}
                  className={
                    'relative px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap ' +
                    (activeState
                      ? 'bg-primary/10 dark:bg-night-primary/15 text-primary dark:text-night-primary'
                      : 'text-on-surface-variant dark:text-night-muted hover:text-on-background dark:hover:text-night-text hover:bg-surface-container-low dark:hover:bg-night-surface-2')
                  }
                >
                  {link.label}
                  <span
                    className={
                      'nav-dot bg-primary dark:bg-night-primary ' +
                      (activeState ? 'opacity-100 scale-100' : 'opacity-0 scale-0')
                    }
                  />
                </button>
              );
            })}
          </nav>

          <div className="w-px h-6 bg-outline-variant/60 dark:bg-night-border mx-1 shrink-0" />

          <form
            onSubmit={onSubmit}
            className={
              'flex items-center transition-all duration-300 ease-out overflow-hidden ' +
              (searchOpen ? 'w-56' : 'w-0')
            }
          >
            <input
              ref={searchRef}
              className="w-full bg-transparent text-body-md text-on-surface dark:text-night-text placeholder:text-on-surface-variant dark:placeholder:text-night-muted outline-none px-2"
              placeholder="Search anything..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setSearchOpen(false)}
            />
          </form>
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant dark:text-night-muted hover:bg-surface-container-low dark:hover:bg-night-surface-2 hover:text-primary dark:hover:text-night-primary transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={onToggleDark}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant dark:text-night-muted hover:bg-surface-container-low dark:hover:bg-night-surface-2 transition-colors"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </header>
      </div>

      {/* Mobile — compact top bar (search + theme toggle); nav lives in BottomNav */}
      <header
        className={
          'nav-autohide fixed top-0 w-full h-16 bg-surface/90 dark:bg-night-bg/90 backdrop-blur-md z-40 flex items-center justify-between px-margin-mobile md:hidden border-b border-outline-variant/20 dark:border-night-border ' +
          (navHidden ? 'nav-hidden' : '')
        }
      >
        <button className="shrink-0" onClick={() => onNavigate('home')} aria-label="ShreeVibe home">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary dark:from-night-primary dark:to-secondary-container flex items-center justify-center text-on-primary dark:text-night-on-primary text-[13px] font-bold">
            S
          </div>
        </button>
        <div className="flex items-center gap-2 flex-1 ml-md">
          <form
            onSubmit={(e) => {
              setQuery(mobileValue);
              onSubmit(e, mobileValue);
            }}
            className="flex-1"
          >
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-night-muted text-[18px]">
                search
              </span>
              <input
                className="w-full bg-surface-container-low dark:bg-night-surface border border-outline-variant/50 dark:border-night-border rounded-full py-2 pl-9 pr-3 text-sm text-on-surface dark:text-night-text outline-none focus:border-primary dark:focus:border-night-primary transition-colors"
                placeholder="Search ShreeVibe..."
                type="text"
                value={mobileValue}
                onChange={(e) => setMobileValue(e.target.value)}
              />
            </div>
          </form>
          <button
            onClick={onToggleDark}
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant dark:text-night-muted"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </header>
    </>
  );
}
