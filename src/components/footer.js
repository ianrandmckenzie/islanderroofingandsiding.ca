const FOOTER_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Areas' },
  { href: '/articles', label: 'Knowledge' },
  { href: '/projects', label: 'Gallery' },
  { href: '/request-a-quote', label: 'Contact' },
];

export function renderFooterHtml() {
  return `
    <div class="mx-auto grid w-full max-w-none gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8 lg:py-14">
      <div class="space-y-4">
        <p class="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Island-ready exteriors</p>
        <p class="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Islander Roofing and Siding builds roof, siding, and maintenance systems for the Mid-Island with details that hold up in salt, wind, and rain.</p>
      </div>

      <div>
        <p class="text-sm font-black uppercase tracking-[0.24em] text-slate-900 dark:text-slate-50">Quick links</p>
        <ul class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          ${FOOTER_LINKS.map(link => `<li><a href="${link.href}" class="inline-flex items-center rounded-full border border-transparent px-3 py-1.5 font-black uppercase tracking-[0.18em] transition hover:border-slate-300 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black dark:hover:border-slate-500 dark:hover:bg-slate-50 dark:hover:text-slate-950">${link.label}</a></li>`).join('')}
        </ul>
      </div>

      <div class="space-y-4">
        <p class="text-sm font-black uppercase tracking-[0.24em] text-slate-900 dark:text-slate-50">What to expect</p>
        <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">Fast responses, clear scopes, and practical recommendations for roofing and siding work across the Comox Valley.</p>
        <a href="/request-a-quote" class="inline-flex items-center rounded-full bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-[0.28em] text-white shadow-sm transition hover:bg-slate-950 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black dark:hover:bg-slate-50 dark:hover:text-slate-950">Request an estimate</a>
      </div>
    </div>
    <div class="border-t border-slate-200/80 px-4 py-4 text-[10px] uppercase tracking-[0.32em] text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
      Serving Courtenay, Comox, Cumberland, Royston, and Union Bay.
    </div>`;
}

export function mountFooter() {
  // Skip creation if already baked in by the post-build script
  if (document.getElementById('site-footer')) return;

  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.className = 'mt-auto border-t border-slate-200/80 bg-white/96 dark:border-slate-800 dark:bg-black/96';
  footer.innerHTML = renderFooterHtml();

  document.body.appendChild(footer);
}
