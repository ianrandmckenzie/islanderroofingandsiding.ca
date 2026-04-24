const INPUT_CLASSES = 'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-sans text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-black dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black';

function applySearchStyles(input) {
  if (input.dataset.uiFilterReady === 'true') return;

  input.classList.add(...INPUT_CLASSES.split(' '));
  if (!input.getAttribute('type')) input.type = 'search';
  input.dataset.uiFilterReady = 'true';
}

function updateSearchResults(input) {
  const targetSelector = input.getAttribute('data-ui-filter-target');
  if (!targetSelector) return;

  const target = document.querySelector(targetSelector);
  if (!target) return;

  const query = input.value.trim().toLowerCase();
  const items = Array.from(target.querySelectorAll('[data-ui-filter-item]'));
  const emptySelector = input.getAttribute('data-ui-filter-empty');
  const countSelector = input.getAttribute('data-ui-filter-count');
  const emptyState = emptySelector ? document.querySelector(emptySelector) : null;
  const countState = countSelector ? document.querySelector(countSelector) : null;

  let visibleCount = 0;

  items.forEach(item => {
    const haystack = `${item.getAttribute('data-filter-text') || ''} ${item.textContent || ''}`.toLowerCase();
    const matches = !query || haystack.includes(query);
    item.hidden = !matches;
    item.setAttribute('aria-hidden', String(!matches));
    if (matches) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount !== 0;
  if (countState) countState.textContent = `${visibleCount} result${visibleCount === 1 ? '' : 's'}`;
}

export function mountSearchFilters() {
  document.querySelectorAll('[data-ui-filter-input]').forEach(input => {
    applySearchStyles(input);
    if (input.dataset.uiFilterBound === 'true') return;

    const handleInput = () => updateSearchResults(input);
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);
    input.dataset.uiFilterBound = 'true';
    updateSearchResults(input);
  });
}
