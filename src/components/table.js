const SHELL_CLASSES = 'overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-black';
const TABLE_CLASSES = 'min-w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-300';
const HEADER_CELL_CLASSES = 'border-b border-slate-200 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:border-slate-800 dark:text-slate-400';
const BODY_CELL_CLASSES = 'border-b border-slate-200 px-4 py-4 align-top dark:border-slate-800';

function applyTableStyles(table) {
  if (table.dataset.uiTableReady === 'true') return;

  const shell = table.parentElement;
  if (shell?.hasAttribute('data-ui-table-shell')) {
    shell.classList.add(...SHELL_CLASSES.split(' '));
  }

  table.classList.add(...TABLE_CLASSES.split(' '));
  table.querySelectorAll('th').forEach(cell => cell.classList.add(...HEADER_CELL_CLASSES.split(' ')));
  table.querySelectorAll('td').forEach(cell => cell.classList.add(...BODY_CELL_CLASSES.split(' ')));

  table.dataset.uiTableReady = 'true';
}

export function mountTables() {
  document.querySelectorAll('[data-ui-table]').forEach(applyTableStyles);
}
