import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, getEffectiveTheme, toggleTheme } from '../../src/theme.js';

function mockMatchMedia(matches) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => ({
      matches,
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('theme helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('uses the stored preference when present', () => {
    mockMatchMedia(false);
    localStorage.setItem('theme-preference', 'light');

    expect(getEffectiveTheme()).toBe('light');
  });

  it('falls back to the system preference when nothing is stored', () => {
    mockMatchMedia(true);

    expect(getEffectiveTheme()).toBe('light');
  });

  it('toggles the document theme and persists the result', () => {
    mockMatchMedia(false);
    applyTheme('dark');

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    const next = toggleTheme();

    expect(next).toBe('light');
    expect(localStorage.getItem('theme-preference')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
