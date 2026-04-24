const GROUP_CLASSES = 'inline-flex w-full items-stretch overflow-hidden rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-black';
const ADDON_CLASSES = 'inline-flex items-center border-0 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300';
const CONTROL_CLASSES = 'min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none dark:text-slate-50 dark:placeholder:text-slate-500';
const ACTION_CLASSES = 'inline-flex items-center border-0 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200';

function applyInputGroup(group) {
  if (group.dataset.uiInputGroupReady === 'true') return;

  group.classList.add(...GROUP_CLASSES.split(' '));

  Array.from(group.children).forEach(child => {
    if (child.matches('input, textarea, select')) {
      child.classList.add(...CONTROL_CLASSES.split(' '));
    } else if (child.matches('button, a')) {
      child.classList.add(...ACTION_CLASSES.split(' '));
    } else {
      child.classList.add(...ADDON_CLASSES.split(' '));
    }
  });

  group.dataset.uiInputGroupReady = 'true';
}

export function mountInputGroups() {
  document.querySelectorAll('[data-ui-input-group]').forEach(applyInputGroup);
}
