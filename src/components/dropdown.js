const ROOT_CLASSES = 'relative inline-flex';
const MENU_CLASSES = 'absolute left-0 top-full z-50 mt-2 min-w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-black';
const ITEM_CLASSES = 'flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-900';

let dropdownCounter = 0;

function setDropdownState(root, trigger, menu, open) {
  root.dataset.open = open ? 'true' : 'false';
  trigger.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;

  if (!open) {
    trigger.focus({ preventScroll: true });
  }
}

function applyDropdownStyles(root) {
  if (root.dataset.uiDropdownReady === 'true') return;

  const trigger = root.querySelector('[data-ui-dropdown-trigger]');
  const menu = root.querySelector('[data-ui-dropdown-menu]');
  if (!trigger || !menu) return;

  root.classList.add(...ROOT_CLASSES.split(' '));

  if (!trigger.id) trigger.id = `ui-dropdown-trigger-${++dropdownCounter}`;
  if (!menu.id) menu.id = `${trigger.id}-menu`;

  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-controls', menu.id);
  trigger.setAttribute('aria-expanded', 'false');
  menu.hidden = true;
  menu.classList.add(...MENU_CLASSES.split(' '));

  root.querySelectorAll('[data-ui-dropdown-item]').forEach(item => {
    item.classList.add(...ITEM_CLASSES.split(' '));
    item.setAttribute('role', 'menuitem');
  });

  const closeMenu = () => setDropdownState(root, trigger, menu, false);
  const toggleMenu = () => setDropdownState(root, trigger, menu, root.dataset.open !== 'true');

  trigger.addEventListener('click', event => {
    event.preventDefault();
    toggleMenu();
  });

  menu.addEventListener('click', event => {
    if (event.target.closest('[data-ui-dropdown-item]')) {
      closeMenu();
    }
  });

  document.addEventListener('click', event => {
    if (root.dataset.open === 'true' && !root.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.dataset.open === 'true') {
      closeMenu();
    }
  });

  root.dataset.uiDropdownReady = 'true';
}

export function mountDropdowns() {
  document.querySelectorAll('[data-ui-dropdown]').forEach(applyDropdownStyles);
}
