const KEY = 'shreevibe-theme';

export function getInitialTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') return saved === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function persistTheme(isDark) {
  localStorage.setItem(KEY, isDark ? 'dark' : 'light');
}
