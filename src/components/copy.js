const BUTTON_CLASSES = 'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-black dark:text-slate-300 dark:hover:border-slate-50 dark:hover:text-slate-50 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-black';

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const fallback = document.createElement('textarea');
  fallback.value = value;
  fallback.setAttribute('readonly', '');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.appendChild(fallback);
  fallback.select();
  document.execCommand('copy');
  document.body.removeChild(fallback);
}

function getCopyValue(button) {
  const targetSelector = button.getAttribute('data-ui-copy-target');
  const target = targetSelector ? document.querySelector(targetSelector) : null;
  if (target) {
    return target.getAttribute('data-copy-value') || target.textContent.trim();
  }

  return button.getAttribute('data-ui-copy-text') || button.dataset.copyText || '';
}

function setCopiedState(button, originalLabel) {
  button.textContent = 'Copied';
  button.setAttribute('aria-label', 'Copied to clipboard');

  window.clearTimeout(button._copyResetTimer);
  button._copyResetTimer = window.setTimeout(() => {
    button.textContent = originalLabel;
    button.setAttribute('aria-label', originalLabel);
  }, 1500);
}

function bindCopyButton(button) {
  if (button.dataset.uiCopyReady === 'true') return;

  button.classList.add(...BUTTON_CLASSES.split(' '));
  if (!button.hasAttribute('type')) button.type = 'button';

  const originalLabel = button.textContent.trim() || 'Copy';
  button.addEventListener('click', async () => {
    const value = getCopyValue(button);
    if (!value) return;

    try {
      await copyText(value);
      setCopiedState(button, originalLabel);
    } catch {
      button.textContent = 'Failed';
      window.clearTimeout(button._copyResetTimer);
      button._copyResetTimer = window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1500);
    }
  });

  button.dataset.uiCopyReady = 'true';
}

export function mountCopyActions() {
  document.querySelectorAll('[data-ui-copy-button]').forEach(bindCopyButton);
}
