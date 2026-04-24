const MODAL_ROOT_CLASSES = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm';
const MODAL_PANEL_CLASSES = 'w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-black md:p-8';

let activeModal = null;
let activeTrigger = null;
let keydownBound = false;

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function focusModal(modal) {
  const panel = modal.querySelector('[data-ui-modal-panel]');
  const focusable = panel ? getFocusableElements(panel) : [];
  const target = focusable[0] || panel || modal;

  if (target && typeof target.focus === 'function') {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

function openModal(modal, trigger) {
  if (activeModal === modal) return;
  if (activeModal) closeModal(activeModal);

  activeModal = modal;
  activeTrigger = trigger || document.activeElement;
  modal.hidden = false;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => focusModal(modal));
}

function closeModal(modal) {
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (activeModal === modal) {
    activeModal = null;
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus({ preventScroll: true });
    }
    activeTrigger = null;
  }
}

function applyModalStyles(modal) {
  if (modal.dataset.uiModalReady === 'true') return;

  modal.classList.add(...MODAL_ROOT_CLASSES.split(' '));
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (!modal.hasAttribute('role')) modal.setAttribute('role', 'dialog');
  if (!modal.hasAttribute('aria-modal')) modal.setAttribute('aria-modal', 'true');

  const panel = modal.querySelector('[data-ui-modal-panel]');
  if (panel) panel.classList.add(...MODAL_PANEL_CLASSES.split(' '));

  modal.dataset.uiModalReady = 'true';
}

function bindModalTriggers() {
  document.querySelectorAll('[data-ui-modal-open]').forEach(trigger => {
    if (trigger.dataset.uiModalOpenBound === 'true') return;

    trigger.addEventListener('click', event => {
      event.preventDefault();
      const selector = trigger.getAttribute('data-ui-modal-open');
      const modal = selector ? document.querySelector(selector) : null;
      if (modal) openModal(modal, trigger);
    });

    trigger.dataset.uiModalOpenBound = 'true';
  });
}

function bindModalDismissals() {
  document.querySelectorAll('[data-ui-modal]').forEach(modal => {
    if (modal.dataset.uiModalDismissBound === 'true') return;

    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-ui-modal-close]')) {
        closeModal(modal);
      }
    });

    modal.dataset.uiModalDismissBound = 'true';
  });
}

function bindModalEscape() {
  if (keydownBound) return;

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });

  keydownBound = true;
}

export function mountModals() {
  document.querySelectorAll('[data-ui-modal]').forEach(applyModalStyles);
  bindModalTriggers();
  bindModalDismissals();
  bindModalEscape();
}
