import { getEffectiveTheme, applyTheme } from './theme.js';
import { mountNav } from './components/nav.js';
import { mountBreadcrumbs } from './components/breadcrumbs.js';
import { mountButtons } from './components/button.js';
import { mountBadges } from './components/badge.js';
import { mountAlerts } from './components/alert.js';
import { mountAccordions } from './components/accordion.js';
import { mountFormFields } from './components/form-field.js';
import { mountInputGroups } from './components/input-group.js';
import { mountCheckboxGroups } from './components/checkbox-group.js';
import { mountRadioGroups } from './components/radio-group.js';
import { mountSwitches } from './components/toggle-switch.js';
import { mountTables } from './components/table.js';
import { mountAvatarStacks } from './components/avatar-stack.js';
import { mountContentCards } from './components/content-card.js';
import { mountComparisonGrids } from './components/comparison-grid.js';
import { mountMetricCards } from './components/metric-card.js';
import { mountPricingTables } from './components/pricing-table.js';
import { mountDropdowns } from './components/dropdown.js';
import { mountSearchFilters } from './components/search-filter.js';
import { mountEstimateCalculators } from './components/estimate-calculator.js';
import { mountModals } from './components/modal.js';
import { mountTabs } from './components/tabs.js';
import { mountCopyActions } from './components/copy.js';
import { mountFooter } from './components/footer.js';

// Apply saved/system theme preference before rendering
applyTheme(getEffectiveTheme());

// Reactively follow OS changes when no preference is stored
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (!localStorage.getItem('theme-preference')) applyTheme(getEffectiveTheme());
});

mountNav();
mountBreadcrumbs();
mountButtons();
mountBadges();
mountAlerts();
mountAccordions();
mountFormFields();
mountInputGroups();
mountCheckboxGroups();
mountRadioGroups();
mountSwitches();
mountTables();
mountAvatarStacks();
mountContentCards();
mountComparisonGrids();
mountMetricCards();
mountPricingTables();
mountDropdowns();
mountSearchFilters();
mountEstimateCalculators();
mountModals();
mountTabs();
mountCopyActions();
mountFooter();

// Insert <wbr> after underscores in any visible text so snake_cased strings
// break cleanly after the underscore on narrow/tablet viewports.
const _wbrWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  { acceptNode: n => {
    const tag = n.parentElement?.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
    return n.textContent.includes('_') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
  }}
);
const _wbrNodes = [];
let _wbrNode;
while ((_wbrNode = _wbrWalker.nextNode())) _wbrNodes.push(_wbrNode);
_wbrNodes.forEach(node => {
  const span = document.createElement('span');
  span.innerHTML = node.textContent.replace(/_/g, '_<wbr>');
  node.parentNode.replaceChild(span, node);
});
