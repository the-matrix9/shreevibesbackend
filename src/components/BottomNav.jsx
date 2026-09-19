import React from 'react';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'explore', label: 'Explore', icon: 'explore' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'api', label: 'API', icon: 'terminal' },
];

export default function BottomNav({ view, onNavigate }) {
  return (
    <nav className="fixed bottom-4 left-0 w-full z-50 flex justify-center md:hidden pointer-events-none">
      <div className="nav-pill pointer-events-auto flex items-center gap-1 rounded-full p-1.5 animate-pop-in">
        {TABS.map((tab) => {
          const activeState = view === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={
                'flex flex-col items-center justify-center rounded-full elastic-touch-feedback transition-all duration-200 w-[60px] h-[52px] gap-0.5 ' +
                (activeState
                  ? 'bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary'
                  : 'text-on-surface-variant dark:text-night-muted active:bg-surface-container-high dark:active:bg-night-surface-2')
              }
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: activeState ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm-mobile">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
