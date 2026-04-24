const CARD_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black';
const LABEL_CLASSES = 'font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400';
const VALUE_CLASSES = 'mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50';
const CHANGE_CLASSES = 'mt-3 text-xs font-bold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-300';

function applyMetricCard(card) {
  if (card.dataset.uiMetricCardReady === 'true') return;

  card.classList.add(...CARD_CLASSES.split(' '));

  const label = card.querySelector('[data-ui-metric-label]') || card.querySelector('small, [data-ui-metric-name]');
  const value = card.querySelector('[data-ui-metric-value]') || card.querySelector('strong');
  const change = card.querySelector('[data-ui-metric-change]');

  if (label) label.classList.add(...LABEL_CLASSES.split(' '));
  if (value) value.classList.add(...VALUE_CLASSES.split(' '));
  if (change) change.classList.add(...CHANGE_CLASSES.split(' '));

  card.dataset.uiMetricCardReady = 'true';
}

export function mountMetricCards() {
  document.querySelectorAll('[data-ui-metric-card]').forEach(applyMetricCard);
}
