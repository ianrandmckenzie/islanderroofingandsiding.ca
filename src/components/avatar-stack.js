const STACK_CLASSES = 'flex items-center';
const AVATAR_CLASSES = 'inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-900 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white dark:border-black dark:bg-slate-50 dark:text-slate-950';

function applyAvatarStack(stack) {
  if (stack.dataset.uiAvatarStackReady === 'true') return;

  const avatars = Array.from(stack.querySelectorAll('[data-ui-avatar]'));
  stack.classList.add(...STACK_CLASSES.split(' '));

  avatars.forEach((avatar, index) => {
    avatar.classList.add(...AVATAR_CLASSES.split(' '));
    avatar.style.zIndex = String(avatars.length - index);
    if (index > 0) avatar.style.marginLeft = '-0.75rem';
  });

  stack.dataset.uiAvatarStackReady = 'true';
}

export function mountAvatarStacks() {
  document.querySelectorAll('[data-ui-avatar-stack]').forEach(applyAvatarStack);
}
