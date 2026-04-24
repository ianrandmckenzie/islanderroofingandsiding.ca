const CARD_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-black';
const TITLE_CLASSES = 'text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-slate-50';
const BODY_CLASSES = 'mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300';
const META_CLASSES = 'font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400';

function applyContentCard(card) {
  if (card.dataset.uiContentCardReady === 'true') return;

  card.classList.add(...CARD_CLASSES.split(' '));

  const title = card.querySelector('[data-ui-content-card-title]') || card.querySelector('h3, h4');
  const body = card.querySelector('[data-ui-content-card-body]') || card.querySelector('p');
  const meta = card.querySelector('[data-ui-content-card-meta]') || card.querySelector('small, [data-ui-content-card-label]');

  if (title) title.classList.add(...TITLE_CLASSES.split(' '));
  if (body) body.classList.add(...BODY_CLASSES.split(' '));
  if (meta) meta.classList.add(...META_CLASSES.split(' '));

  card.dataset.uiContentCardReady = 'true';
}

export function mountContentCards() {
  document.querySelectorAll('[data-ui-content-card]').forEach(applyContentCard);
}
