const BADGE_VARIANTS = {
  neutral: 'inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300',
  solid: 'inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white dark:border-slate-50 dark:bg-slate-50 dark:text-slate-950',
  outline: 'inline-flex items-center rounded-full border border-slate-900 bg-transparent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900 dark:border-slate-50 dark:text-slate-50',
  subtle: 'inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
};

function applyBadgeStyles(element) {
  if (element.dataset.uiBadgeReady === 'true') return;

  const variant = element.dataset.variant || element.getAttribute('data-ui-badge') || 'neutral';
  const classes = BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.neutral;
  element.classList.add(...classes.split(' ').filter(Boolean));
  element.dataset.uiBadgeReady = 'true';
}

export function mountBadges() {
  document.querySelectorAll('[data-ui-badge]').forEach(applyBadgeStyles);
}

export function createBadge(label, options = {}) {
  const element = document.createElement(options.tagName || 'span');
  element.dataset.uiBadge = options.variant || 'neutral';
  element.dataset.variant = options.variant || 'neutral';

  if (options.title) {
    element.title = options.title;
  }

  if (options.ariaLabel) {
    element.setAttribute('aria-label', options.ariaLabel);
  }

  element.textContent = label;
  applyBadgeStyles(element);
  return element;
}
