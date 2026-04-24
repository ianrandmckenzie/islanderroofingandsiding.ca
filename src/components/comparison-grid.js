const GRID_CLASSES = 'grid gap-4';
const COLUMN_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black';
const FEATURED_CLASSES = 'border-slate-900 ring-1 ring-slate-900 dark:border-slate-50 dark:ring-slate-50';
const ROW_CLASSES = 'grid grid-cols-[1.1fr_repeat(2,minmax(0,1fr))] gap-3 border-t border-slate-200 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300';

function applyComparisonGrid(grid) {
  if (grid.dataset.uiComparisonGridReady === 'true') return;

  grid.classList.add(...GRID_CLASSES.split(' '));

  grid.querySelectorAll('[data-ui-comparison-column]').forEach(column => {
    column.classList.add(...COLUMN_CLASSES.split(' '));
    if (column.dataset.featured === 'true') column.classList.add(...FEATURED_CLASSES.split(' '));
  });

  grid.querySelectorAll('[data-ui-comparison-row]').forEach(row => row.classList.add(...ROW_CLASSES.split(' ')));

  grid.dataset.uiComparisonGridReady = 'true';
}

export function mountComparisonGrids() {
  document.querySelectorAll('[data-ui-comparison-grid]').forEach(applyComparisonGrid);
}
