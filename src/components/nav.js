const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Areas' },
  { href: '/articles', label: 'Knowledge' },
  { href: '/projects', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/request-a-quote', label: 'Contact' },
];

const THEME_LABELS = { light: 'Light', dark: 'Dark' };
const getThemeLabel = pref => THEME_LABELS[pref] ?? (pref === 'dark' ? 'Dark' : 'Light');

function normalizePath() {
  const pathname = window.location.pathname.replace(/\.html$/, '');
  return pathname === '/index' ? '/' : pathname;
}

function navLinkClasses(active) {
  return active
    ? 'text-primary border-b border-primary pb-1 uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black'
    : 'text-secondary hover:text-primary transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black';
}

export function syncAnchorOffset() {
  const header = document.getElementById('site-header');
  const breadcrumbs = document.getElementById('site-breadcrumbs');
  const headerHeight = header?.offsetHeight ?? 0;
  const breadcrumbsHeight = breadcrumbs?.offsetHeight ?? 0;
  const offset = Math.max(headerHeight + breadcrumbsHeight + 16, 96);

  document.documentElement.style.setProperty('--site-anchor-offset', `${offset}px`);
}

export function renderNavInnerHtml(currentPath) {
  return `
    <div class="flex w-full items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
      <a href="/" class="flex min-w-0 items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black">
        <img src="/assets/islander-roofing-and-siding-logo.webp" alt="Islander Roofing and Siding logo" class="w-20 shrink-0 object-contain sm:w-24 lg:w-24">
        <span class="min-w-0">
          <span class="block font-sans text-sm font-black uppercase tracking-[0.24em] text-slate-900 dark:text-slate-50">Islander Roofing &amp; Siding</span>
          <span class="block text-[10px] font-mono uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Protection-first exterior systems</span>
        </span>
      </a>

      <a href="tel:17785857866" class="hidden shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left transition hover:border-primary hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-black dark:hover:bg-slate-950 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black lg:inline-flex">
        <span class="flex flex-col leading-tight">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Call Now</span>
          <span class="text-sm font-black tracking-[0.18em] text-slate-950 dark:text-slate-50">1 (778) 585-7866</span>
        </span>
      </a>

      <div class="flex flex-1 items-center justify-end gap-2 sm:gap-3">
        <nav aria-label="Primary" class="hidden flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:flex">
          ${NAV_ITEMS.map(item => {
            const active = currentPath === item.href || (item.href === '/' && currentPath === '/');
            return `<a href="${item.href}" class="text-xs font-black tracking-[0.22em] ${navLinkClasses(active)}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
          }).join('')}
        </nav>

        <a href="/request-a-quote" class="hidden rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black sm:inline-flex">Request quote</a>

        <button id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile-menu" class="rounded-full border border-slate-200 p-2 text-secondary transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black dark:border-slate-800 lg:hidden">
          <svg class="nav-icon-open h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg class="nav-icon-close hidden h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div id="nav-mobile-menu" class="hidden border-t border-slate-200/80 bg-white/96 dark:border-slate-800 dark:bg-black/96 lg:hidden">
      <nav aria-label="Mobile" class="mx-auto flex max-w-none flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
        ${NAV_ITEMS.map(item => {
          const active = currentPath === item.href || (item.href === '/' && currentPath === '/');
          return `<a href="${item.href}" class="rounded-2xl px-4 py-3 text-xs font-black tracking-[0.22em] ${active ? 'bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950' : 'text-secondary hover:text-primary'}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
        }).join('')}
        <a href="/request-a-quote" class="mt-2 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-xs font-black uppercase tracking-[0.3em] text-white">Request quote</a>
      </nav>
    </div>`;
}

export function mountNav() {
  if (!document.querySelector('a[href="#main-content"]')) {
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:z-[100] focus-visible:px-6 focus-visible:py-3 focus-visible:bg-white dark:focus-visible:bg-black focus-visible:text-slate-900 dark:focus-visible:text-slate-100 focus-visible:border-2 focus-visible:border-slate-900 dark:focus-visible:border-slate-100 focus-visible:font-bold focus-visible:text-sm focus-visible:rounded focus-visible:shadow-2xl focus-visible:outline-none';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  const currentPath = normalizePath();

  let header = document.getElementById('site-header');
  if (!header) {
    header = document.createElement('header');
    header.id = 'site-header';
    header.className = 'fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl dark:border-slate-800 dark:bg-black/92';
    header.innerHTML = renderNavInnerHtml(currentPath);

    document.body.insertBefore(header, document.body.firstChild);
  }

  const toggle = header.querySelector('#nav-toggle');
  const mobileMenu = header.querySelector('#nav-mobile-menu');
  const iconOpen = header.querySelector('.nav-icon-open');
  const iconClose = header.querySelector('.nav-icon-close');

  toggle?.addEventListener('click', () => {
    const opening = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !opening);
    iconOpen.classList.toggle('hidden', opening);
    iconClose.classList.toggle('hidden', !opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  });

  const syncPadding = () => {
    document.body.style.paddingTop = `${header.offsetHeight}px`;
    syncAnchorOffset();
  };

  syncPadding();
  new ResizeObserver(syncPadding).observe(header);
}
