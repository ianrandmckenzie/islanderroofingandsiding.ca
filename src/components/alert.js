const ALERT_VARIANTS = {
  info: 'border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
  success: 'border-slate-400 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100',
  warning: 'border-slate-500 bg-slate-50 text-slate-900 dark:border-slate-400 dark:bg-black dark:text-slate-50',
  danger: 'border-slate-900 bg-white text-slate-900 dark:border-slate-50 dark:bg-black dark:text-slate-50',
};

function applyAlertStyles(element) {
  if (element.dataset.uiAlertReady === 'true') return;

  const tone = element.dataset.variant || element.getAttribute('data-ui-alert') || 'info';
  const classes = ALERT_VARIANTS[tone] ?? ALERT_VARIANTS.info;
  element.classList.add('relative', 'rounded-lg', 'border', 'px-4', 'py-4', 'pr-12', 'font-sans', 'text-sm', 'leading-relaxed');
  element.classList.add(...classes.split(' ').filter(Boolean));

  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'alert');
  }

  if (element.dataset.dismissible === 'true' && !element.querySelector('[data-ui-alert-dismiss]')) {
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss alert');
    dismiss.dataset.uiAlertDismiss = 'true';
    dismiss.className = 'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-50 dark:hover:text-slate-50 dark:focus-visible:outline-slate-50';
    dismiss.innerHTML = '<span aria-hidden="true">&times;</span>';
    dismiss.addEventListener('click', () => element.remove());
    element.appendChild(dismiss);
  }

  element.dataset.uiAlertReady = 'true';
}

export function mountAlerts() {
  document.querySelectorAll('[data-ui-alert]').forEach(applyAlertStyles);
}

export function createAlert(message, options = {}) {
  const element = document.createElement(options.tagName || 'div');
  element.dataset.uiAlert = options.variant || 'info';
  element.dataset.variant = options.variant || 'info';

  if (options.dismissible) {
    element.dataset.dismissible = 'true';
  }

  element.textContent = message;
  applyAlertStyles(element);
  return element;
}
