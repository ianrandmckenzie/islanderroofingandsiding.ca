const GROUP_CLASSES = 'grid gap-3';
const LEGEND_CLASSES = 'mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400';
const ITEM_CLASSES = 'flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-black';
const INPUT_CLASSES = 'mt-1 h-4 w-4 rounded-full border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-slate-50';
const TEXT_CLASSES = 'text-sm text-slate-700 dark:text-slate-300';

function applyRadioGroup(group) {
  if (group.dataset.uiRadioGroupReady === 'true') return;

  group.classList.add(...GROUP_CLASSES.split(' '));

  const legend = group.querySelector('legend');
  if (legend) legend.classList.add(...LEGEND_CLASSES.split(' '));

  group.querySelectorAll('label').forEach(label => {
    label.classList.add(...ITEM_CLASSES.split(' '));
    const input = label.querySelector('input[type="radio"]');
    if (input) input.classList.add(...INPUT_CLASSES.split(' '));
    const text = label.querySelector('span:last-child');
    if (text) text.classList.add(...TEXT_CLASSES.split(' '));
  });

  group.dataset.uiRadioGroupReady = 'true';
}

export function mountRadioGroups() {
  document.querySelectorAll('[data-ui-radio-group]').forEach(applyRadioGroup);
}
