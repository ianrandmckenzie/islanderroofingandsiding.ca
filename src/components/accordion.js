const ITEM_CLASSES = 'rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-black';
const TRIGGER_CLASSES = 'flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-sans text-sm font-bold text-slate-900 transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:text-slate-50 dark:hover:text-slate-200 dark:focus-visible:outline-slate-50';
const PANEL_CLASSES = 'px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300';
const ICON_CLASSES = 'font-mono text-sm text-slate-500 transition-transform duration-200 dark:text-slate-400';

function setAccordionState(item, trigger, panel, icon, isOpen) {
  trigger.setAttribute('aria-expanded', String(isOpen));
  panel.hidden = !isOpen;
  item.dataset.open = isOpen ? 'true' : 'false';

  if (icon) {
    icon.textContent = isOpen ? '−' : '+';
    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function applyAccordionItem(item) {
  if (item.dataset.uiAccordionReady === 'true') return;

  const trigger = item.querySelector('[data-ui-accordion-trigger]');
  const panel = item.querySelector('[data-ui-accordion-panel]');
  if (!trigger || !panel) return;

  const icon = trigger.querySelector('[data-ui-accordion-icon]');
  const isOpen = item.dataset.defaultOpen === 'true';

  item.classList.add(...ITEM_CLASSES.split(' '));
  trigger.classList.add(...TRIGGER_CLASSES.split(' '));
  panel.classList.add(...PANEL_CLASSES.split(' '));
  if (icon) icon.classList.add(...ICON_CLASSES.split(' '));

  setAccordionState(item, trigger, panel, icon, isOpen);

  trigger.addEventListener('click', () => {
    const nextOpen = trigger.getAttribute('aria-expanded') !== 'true';
    setAccordionState(item, trigger, panel, icon, nextOpen);
  });

  item.dataset.uiAccordionReady = 'true';
}

export function mountAccordions() {
  document.querySelectorAll('[data-ui-accordion-item]').forEach(applyAccordionItem);
}
