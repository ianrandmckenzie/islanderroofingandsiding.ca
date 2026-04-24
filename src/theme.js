// Returns the active theme, resolving system preference (defaults to dark)
export function getEffectiveTheme() {
  const stored = localStorage.getItem('theme-preference');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(pref) {
  if (pref === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
}

export function toggleTheme() {
  const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme-preference', next);
  applyTheme(next);
  return next;
}
