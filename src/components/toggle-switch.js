const SWITCH_CLASSES = 'inline-flex items-center gap-3';
const LABEL_CLASSES = 'text-sm font-bold text-slate-700 dark:text-slate-300';
const TRACK_CLASSES = 'relative inline-flex h-6 w-11 items-center rounded-full border border-slate-300 bg-slate-200 p-0.5 transition-colors dark:border-slate-700 dark:bg-slate-800';
const THUMB_CLASSES = 'h-5 w-5 rounded-full bg-white shadow-sm transition-transform dark:bg-slate-50';

function syncSwitch(root, input, track, thumb) {
  const checked = input.checked;
  root.dataset.state = checked ? 'on' : 'off';
  input.setAttribute('aria-checked', String(checked));
  track.classList.toggle('bg-slate-900', checked);
  track.classList.toggle('dark:bg-slate-100', checked);
  thumb.style.transform = checked ? 'translateX(1.25rem)' : 'translateX(0)';
}

function bindSwitch(root) {
  if (root.dataset.uiSwitchReady === 'true') return;

  const input = root.querySelector('input[type="checkbox"]');
  const track = root.querySelector('[data-ui-switch-track]');
  const thumb = root.querySelector('[data-ui-switch-thumb]');
  if (!input || !track || !thumb) return;

  root.classList.add(...SWITCH_CLASSES.split(' '));

  const label = root.querySelector('[data-ui-switch-label]');
  if (label) label.classList.add(...LABEL_CLASSES.split(' '));

  input.classList.add('sr-only');
  input.setAttribute('role', 'switch');
  track.classList.add(...TRACK_CLASSES.split(' '));
  thumb.classList.add(...THUMB_CLASSES.split(' '));

  const update = () => syncSwitch(root, input, track, thumb);
  input.addEventListener('change', update);
  update();

  root.dataset.uiSwitchReady = 'true';
}

export function mountSwitches() {
  document.querySelectorAll('[data-ui-switch]').forEach(bindSwitch);
}
