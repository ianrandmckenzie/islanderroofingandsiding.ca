const FIELD_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black';
const LABEL_CLASSES = 'mb-2 block font-sans text-sm font-bold text-slate-900 dark:text-slate-50';
const HELP_CLASSES = 'mt-2 text-xs text-slate-500 dark:text-slate-400';
const ERROR_CLASSES = 'mt-2 text-xs font-bold text-slate-600 dark:text-slate-300';
const CONTROL_CLASSES = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-sans text-sm text-slate-900 placeholder:text-slate-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-black dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black';

let fieldCounter = 0;

function applyFieldStyles(field) {
  if (field.dataset.uiFieldReady === 'true') return;

  const control = field.querySelector('input, textarea, select');
  if (!control) return;

  const label = field.querySelector('[data-ui-field-label]') || field.querySelector('label');
  const help = field.querySelector('[data-ui-field-help]');
  const error = field.querySelector('[data-ui-field-error]');

  field.classList.add(...FIELD_CLASSES.split(' '));
  if (label) label.classList.add(...LABEL_CLASSES.split(' '));
  control.classList.add(...CONTROL_CLASSES.split(' '));

  if (!control.id) {
    control.id = field.id ? `${field.id}-control` : `ui-field-${++fieldCounter}`;
  }

  if (label && !label.getAttribute('for')) {
    label.setAttribute('for', control.id);
  }

  const describedBy = [];
  if (help) {
    if (!help.id) help.id = `${control.id}-help`;
    help.classList.add(...HELP_CLASSES.split(' '));
    describedBy.push(help.id);
  }

  if (error) {
    if (!error.id) error.id = `${control.id}-error`;
    error.classList.add(...ERROR_CLASSES.split(' '));
    describedBy.push(error.id);
  }

  if (describedBy.length) {
    control.setAttribute('aria-describedby', describedBy.join(' '));
  }

  field.dataset.uiFieldReady = 'true';
}

export function mountFormFields() {
  document.querySelectorAll('[data-ui-field]').forEach(applyFieldStyles);
}
