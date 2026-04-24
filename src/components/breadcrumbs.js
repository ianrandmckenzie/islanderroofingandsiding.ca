import { getEffectiveTheme, toggleTheme } from '../theme.js';
import { mountTooltip } from './tooltip.js';
import { getThemeLabel, renderThemeToggleButton, THEME_ICONS } from './theme-toggle.js';
import { syncAnchorOffset } from './nav.js';

const SECTION_LABELS = {
  'services':     'Services',
  'areas':        'Areas',
  'articles':     'Knowledge',
  'projects':     'Gallery',
  'about':        'About',
  'request-a-quote': 'Contact',
};

export function mountBreadcrumbs() {
  const pathname = window.location.pathname.replace(/\.html$/, '');

  if (pathname.startsWith('/html/')) return;

  const currentLabel = document.querySelector('meta[name="bc-label"]')?.content ?? 'Home';
  const segments = pathname === '/' || pathname === '' ? [] : pathname.replace(/^\//, '').split('/').filter(Boolean);

  const crumbs = pathname === '/' || pathname === ''
    ? [{ label: 'Islander Roofing & Siding', href: '/' }, { label: 'Home' }]
    : [{ label: 'Home', href: '/' }];

  if (pathname !== '/' && pathname !== '') {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const isLast = i === segments.length - 1;
      if (isLast) {
        crumbs.push({ label: currentLabel });
      } else {
        crumbs.push({ label: SECTION_LABELS[seg] ?? seg, href: '/' + segments.slice(0, i + 1).join('/') });
      }
    }
  }

  const items = crumbs
    .map((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      if (isLast) {
        return `<li aria-current="page">
          <span class="text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase tracking-widest">${crumb.label}</span>
        </li>`;
      }
      return `
        <li>
          <a href="${crumb.href}"
             class="text-slate-600 dark:text-slate-300 hover:text-primary font-mono text-[10px] uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black">
            ${crumb.label}
          </a>
        </li>
        <li aria-hidden="true" class="text-slate-400 dark:text-slate-700 font-mono text-[10px] select-none">/</li>`;
    })
    .join('');

  let nav = document.getElementById('site-breadcrumbs');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'site-breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.className = 'border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-black/80';

    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
      siteHeader.insertAdjacentElement('afterend', nav);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  nav.innerHTML = `
    <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
      <ol class="flex min-w-0 flex-1 flex-wrap items-center gap-2" role="list">${items}</ol>
      <div class="ml-auto flex shrink-0 items-center justify-end">${renderThemeToggleButton(getEffectiveTheme(), 'shrink-0')}</div>
    </div>
  `;

  syncAnchorOffset();

  new ResizeObserver(syncAnchorOffset).observe(nav);

  const themeButton = nav.querySelector('#theme-toggle');
  if (!themeButton) return;

  const tooltip = mountTooltip();
  let currentPref = getEffectiveTheme();

  themeButton.innerHTML = THEME_ICONS[currentPref];
  themeButton.setAttribute('aria-label', `Switch theme: currently ${getThemeLabel(currentPref)}`);
  themeButton.setAttribute('title', `Theme: ${getThemeLabel(currentPref)}`);
  themeButton.setAttribute('data-title', `Theme: ${getThemeLabel(currentPref)}`);

  themeButton.addEventListener('click', () => {
    currentPref = toggleTheme();
    themeButton.innerHTML = THEME_ICONS[currentPref];
    themeButton.setAttribute('aria-label', `Switch theme: currently ${getThemeLabel(currentPref)}`);
    themeButton.setAttribute('title', `Theme: ${getThemeLabel(currentPref)}`);
    themeButton.setAttribute('data-title', `Theme: ${getThemeLabel(currentPref)}`);
    tooltip.refresh(themeButton);
  });
}
