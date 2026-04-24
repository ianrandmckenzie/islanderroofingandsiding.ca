const BUTTON_VARIANTS = {
  primary: 'inline-flex items-center justify-center gap-2 rounded border border-slate-900 bg-slate-900 px-4 py-2.5 font-sans text-sm font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:border-slate-50 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:outline-slate-50',
  secondary: 'inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 font-sans text-sm font-bold text-slate-900 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:border-slate-700 dark:bg-black dark:text-slate-50 dark:hover:border-slate-50 dark:hover:bg-slate-950 dark:focus-visible:outline-slate-50',
  ghost: 'inline-flex items-center justify-center gap-2 rounded px-3 py-2 font-sans text-sm font-bold text-slate-700 transition-colors duration-150 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:text-slate-300 dark:hover:text-slate-50 dark:focus-visible:outline-slate-50',
};

const BUTTON_SIZES = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

function normalizeButtonOptions(options = {}) {
  return {
    variant: options.variant ?? 'primary',
    size: options.size ?? 'md',
    label: options.label ?? '',
    href: options.href ?? '',
    title: options.title ?? '',
    ariaLabel: options.ariaLabel ?? '',
    disabled: Boolean(options.disabled),
    type: options.type ?? 'button',
  };
}

function applyButtonStyles(element) {
  if (element.dataset.uiButtonReady === 'true') return;

  const variant = element.dataset.variant || element.getAttribute('data-ui-button') || 'primary';
  const size = element.dataset.size || 'md';
  const classes = [BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.primary, BUTTON_SIZES[size] ?? BUTTON_SIZES.md];

  classes.forEach(className => element.classList.add(...className.split(' ').filter(Boolean)));

  if (element.tagName === 'BUTTON' && !element.hasAttribute('type')) {
    element.type = 'button';
  }

  if (element.dataset.title) {
    element.setAttribute('title', element.dataset.title);
  }

  if (element.dataset.ariaLabel) {
    element.setAttribute('aria-label', element.dataset.ariaLabel);
  }

  if (element.dataset.disabled === 'true') {
    element.setAttribute('disabled', '');
    element.setAttribute('aria-disabled', 'true');
    element.tabIndex = -1;
    element.classList.add('cursor-not-allowed', 'pointer-events-none', 'opacity-60', 'hover:translate-y-0');
  }

  element.dataset.uiButtonReady = 'true';
}

export function mountButtons() {
  document.querySelectorAll('[data-ui-button]').forEach(applyButtonStyles);
}

export function createButton(options = {}) {
  const config = normalizeButtonOptions(options);
  const element = config.href ? document.createElement('a') : document.createElement('button');

  element.dataset.uiButton = config.variant;
  element.dataset.variant = config.variant;
  element.dataset.size = config.size;

  if (config.href) {
    element.href = config.href;
  } else {
    element.type = config.type;
  }

  if (config.title) {
    element.dataset.title = config.title;
    element.title = config.title;
  }

  if (config.ariaLabel) {
    element.dataset.ariaLabel = config.ariaLabel;
    element.setAttribute('aria-label', config.ariaLabel);
  }

  if (config.disabled) {
    element.dataset.disabled = 'true';
  }

  element.textContent = config.label;
  applyButtonStyles(element);
  return element;
}
