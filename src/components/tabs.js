const TABLIST_CLASSES = 'inline-flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950';
const TAB_CLASSES = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2 dark:focus-visible:outline-slate-100';
const ACTIVE_TAB_CLASSES = 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950';
const INACTIVE_TAB_CLASSES = 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100';
const PANEL_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black md:p-6';

function setTabState(tablist, tab, panel, isActive) {
  tab.setAttribute('aria-selected', String(isActive));
  tab.setAttribute('tabindex', isActive ? '0' : '-1');
  panel.hidden = !isActive;

  tab.classList.toggle('pointer-events-none', false);
  tab.classList.remove(...ACTIVE_TAB_CLASSES.split(' '), ...INACTIVE_TAB_CLASSES.split(' '));
  tab.classList.add(...TAB_CLASSES.split(' '));
  tab.classList.add(...(isActive ? ACTIVE_TAB_CLASSES : INACTIVE_TAB_CLASSES).split(' '));

  if (isActive) {
    tablist.dataset.activeTab = tab.id;
  }
}

function activateTab(tablist, tabId) {
  const tabs = Array.from(tablist.querySelectorAll('[data-ui-tab]'));
  const panels = Array.from(tablist.querySelectorAll('[data-ui-tab-panel]'));
  const activeTab = tabs.find(tab => tab.id === tabId) || tabs[0];

  tabs.forEach(tab => {
    const panel = document.querySelector(tab.getAttribute('data-ui-tab-panel'));
    if (!panel) return;
    setTabState(tablist, tab, panel, tab === activeTab);
  });
}

function bindTablist(tablist) {
  if (tablist.dataset.uiTabsReady === 'true') return;

  const tabs = Array.from(tablist.querySelectorAll('[data-ui-tab]'));
  const panels = Array.from(tablist.querySelectorAll('[data-ui-tab-panel]'));
  if (!tabs.length || !panels.length) return;

  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-orientation', 'horizontal');
  tablist.classList.add(...TABLIST_CLASSES.split(' '));

  tabs.forEach((tab, index) => {
    const panel = document.querySelector(tab.getAttribute('data-ui-tab-panel'));
    if (!panel) return;

    tab.classList.add(...TAB_CLASSES.split(' '));
    panel.classList.add(...PANEL_CLASSES.split(' '));
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('id', tab.id || `${tablist.id || 'tabs'}-tab-${index + 1}`);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);

    tab.addEventListener('click', () => activateTab(tablist, tab.id));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      const currentIndex = tabs.indexOf(tab);
      let nextIndex = currentIndex;

      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      const nextTab = tabs[nextIndex];
      activateTab(tablist, nextTab.id);
      nextTab.focus();
    });
  });

  const initialTab = tabs.find(tab => tab.dataset.default === 'true') || tabs[0];
  activateTab(tablist, initialTab.id);
  tablist.dataset.uiTabsReady = 'true';
}

export function mountTabs() {
  document.querySelectorAll('[data-ui-tabs]').forEach(bindTablist);
}
