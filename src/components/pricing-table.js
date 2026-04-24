const TABLE_CLASSES = 'grid gap-4 lg:grid-cols-3';
const PLAN_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-black';
const FEATURED_CLASSES = 'border-slate-900 ring-1 ring-slate-900 dark:border-slate-50 dark:ring-slate-50';
const TIER_CLASSES = 'font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400';
const PRICE_CLASSES = 'mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50';
const LIST_CLASSES = 'mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300';

function applyPricingTable(table) {
  if (table.dataset.uiPricingTableReady === 'true') return;

  table.classList.add(...TABLE_CLASSES.split(' '));

  table.querySelectorAll('[data-ui-pricing-plan]').forEach(plan => {
    plan.classList.add(...PLAN_CLASSES.split(' '));
    if (plan.dataset.featured === 'true') plan.classList.add(...FEATURED_CLASSES.split(' '));

    const tier = plan.querySelector('[data-ui-pricing-tier]');
    const price = plan.querySelector('[data-ui-pricing-price]');
    const features = plan.querySelector('[data-ui-pricing-features]');

    if (tier) tier.classList.add(...TIER_CLASSES.split(' '));
    if (price) price.classList.add(...PRICE_CLASSES.split(' '));
    if (features) features.classList.add(...LIST_CLASSES.split(' '));
  });

  table.dataset.uiPricingTableReady = 'true';
}

export function mountPricingTables() {
  document.querySelectorAll('[data-ui-pricing-table]').forEach(applyPricingTable);
}
