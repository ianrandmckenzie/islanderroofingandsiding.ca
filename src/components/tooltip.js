export function mountTooltip() {
  /* ── Singleton tooltip element ── */
  const el = document.createElement('div');
  el.id = 'site-tooltip';
  el.setAttribute('role', 'tooltip');
  el.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;visibility:hidden;';

  el.innerHTML = `
    <div id="tt-inner" style="position:relative;display:inline-block;">
      <div id="tt-bg" class="bg-slate-50 dark:bg-slate-800" style="position:absolute;inset:0;opacity:0;border-radius:2px;"></div>
      <svg id="tt-svg" class="text-slate-600 dark:text-slate-300" style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;" aria-hidden="true">
        <circle id="tt-dot" r="3.5" fill="currentColor" />
        <path id="tt-path-l" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="miter" />
        <path id="tt-path-r" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="miter" />
      </svg>
      <div id="tt-content" class="text-slate-500 dark:text-slate-300 font-sans italic" style="padding:8px 14px;white-space:nowrap;font-size:0.875rem;opacity:0;position:relative;z-index:2;"></div>
    </div>
  `;

  document.body.appendChild(el);

  const inner   = el.querySelector('#tt-inner');
  const bg      = el.querySelector('#tt-bg');
  const svg     = el.querySelector('#tt-svg');
  const dot     = el.querySelector('#tt-dot');
  const pathL   = el.querySelector('#tt-path-l');
  const pathR   = el.querySelector('#tt-path-r');
  const content = el.querySelector('#tt-content');

  // Tell the browser to use the element's own bounding box as the transform origin
  // so scale(0) collapses the dot to its own center, not the SVG origin.
  dot.style.transformBox    = 'fill-box';
  dot.style.transformOrigin = 'center';

  let activeTarget = null;
  let timers       = [];
  let isVisible    = false;

  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  // Reads hover:text-* / dark:hover:text-* classes to find the accent color without
  // depending on computed styles (which are mid-transition at mouseover time).
  // Handles both legacy rgb() and modern oklch() color formats (TailwindCSS v4 uses oklch).
  const isGrayish = colorStr => {
    const rgb = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgb) return (Math.max(+rgb[1], +rgb[2], +rgb[3]) - Math.min(+rgb[1], +rgb[2], +rgb[3])) < 30;
    const oklch = colorStr.match(/oklch\([^\s]+\s+([\d.]+)/);
    if (oklch) return parseFloat(oklch[1]) < 0.05;
    return true;
  };
  function getAccentColor(target) {
    const dark  = document.documentElement.classList.contains('dark');
    const nodes = [target, ...target.querySelectorAll('*')];
    for (const node of nodes) {
      let lightPart = null, darkPart = null;
      for (const cls of node.classList) {
        if (/^dark:(?:group-)?hover:text-/.test(cls))  darkPart  = cls.replace(/^dark:(?:group-)?hover:text-/, '');
        if (/^(?:group-)?hover:text-/.test(cls))        lightPart = cls.replace(/^(?:group-)?hover:text-/, '');
      }
      const chosen = dark ? (darkPart || lightPart) : lightPart;
      if (!chosen) continue;
      const probe = document.createElement('span');
      probe.className  = `text-${chosen}`;
      probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
      document.body.appendChild(probe);
      const color = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      if (!isGrayish(color)) return color;
    }
    return null;
  }

  /* ── Reset all animated properties to their pre-show state ── */
  function resetVisuals() {
    svg.style.color               = '';
    dot.style.transition          = 'none';
    dot.style.opacity             = '0';
    dot.style.transform           = 'scale(0)';
    pathL.style.transition        = 'none';
    pathR.style.transition        = 'none';
    pathL.style.strokeDashoffset  = pathL.getAttribute('data-len') || '9999';
    pathR.style.strokeDashoffset  = pathR.getAttribute('data-len') || '9999';
    bg.style.transition           = 'none';
    bg.style.opacity              = '0';
    content.style.transition      = 'none';
    content.style.opacity         = '0';
  }

  function hideImmediate() {
    el.style.visibility = 'hidden';
    isVisible = false;
    if (activeTarget) {
      activeTarget.classList.remove('tooltip-target-active');
      activeTarget = null;
    }
    resetVisuals();
  }

  function hide() {
    if (!isVisible) return;
    clearTimers();

    el.style.transition = 'opacity 150ms ease-out';
    el.style.opacity    = '0';

    timers.push(setTimeout(() => {
      el.style.visibility = 'hidden';
      el.style.transition = '';
      el.style.opacity    = '';
      isVisible = false;
      if (activeTarget) {
        activeTarget.classList.remove('tooltip-target-active');
        activeTarget = null;
      }
      resetVisuals();
    }, 160));
  }

  function show(target) {
    if (target === activeTarget && isVisible) return;
    clearTimers();
    if (isVisible) hideImmediate();

    activeTarget = target;
    target.classList.add('tooltip-target-active');

    const text = target.getAttribute('data-title');
    content.textContent = text;
    resetVisuals();
    // Set accent color AFTER resetVisuals so it isn't cleared
    svg.style.color = getAccentColor(target) || '';

    // Render off-screen (visibility:visible so layout runs) to measure natural size
    el.style.left       = '-9999px';
    el.style.top        = '-9999px';
    el.style.visibility = 'visible';
    el.style.opacity    = '1';
    isVisible = true;

    const w  = inner.offsetWidth;
    const h  = inner.offsetHeight;
    const cx = Math.round(w / 2);

    // Two mirrored paths: each starts at center-top and draws half of the rectangle,
    // meeting at center-bottom — matching the symmetric "grow from dot" animation in the spec.
    pathL.setAttribute('d', `M ${cx},0 H 0 V ${h} H ${cx}`);
    pathR.setAttribute('d', `M ${cx},0 H ${w} V ${h} H ${cx}`);

    const lenL = pathL.getTotalLength();
    const lenR = pathR.getTotalLength();
    pathL.setAttribute('data-len', lenL);
    pathR.setAttribute('data-len', lenR);
    pathL.style.strokeDasharray  = `${lenL}`;
    pathL.style.strokeDashoffset = `${lenL}`;
    pathR.style.strokeDasharray  = `${lenR}`;
    pathR.style.strokeDashoffset = `${lenR}`;

    // Dot sits at the center of the top edge (the animation origin point)
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', 0);

    // ── Smart positioning ──
    const tr   = target.getBoundingClientRect();
    let   left = tr.left + tr.width  / 2 - w / 2;
    let   top  = tr.bottom + 14;

    // Flip above target when there isn't enough room below
    if (top + h + 14 > window.innerHeight) top = tr.top - h - 14;

    // Clamp to viewport with a small margin
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));

    el.style.left = `${left}px`;
    el.style.top  = `${top}px`;

    // ── Phase 1: Dot appears (T+0ms, 150ms) ──
    requestAnimationFrame(() => {
      dot.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out';
      dot.style.opacity    = '1';
      dot.style.transform  = 'scale(1)';
    });

    // ── Phase 2: Rectangle border draws (T+150ms, 400ms) ──
    timers.push(setTimeout(() => {
      const t = 'stroke-dashoffset 400ms ease-in-out';
      pathL.style.transition        = t;
      pathR.style.transition        = t;
      pathL.style.strokeDashoffset  = '0';
      pathR.style.strokeDashoffset  = '0';
    }, 150));

    // ── Phase 3: Background + text fade in (T+550ms, 200ms) ──
    timers.push(setTimeout(() => {
      bg.style.transition      = 'opacity 200ms ease-in';
      bg.style.opacity         = '1';
      content.style.transition = 'opacity 200ms ease-in';
      content.style.opacity    = '1';
    }, 550));
  }

  /* ── Event delegation ── */

  // Desktop — mouse events
  document.addEventListener('mouseover', e => {
    if ('ontouchstart' in window) return;
    const t = e.target.closest('[data-title]');
    if (t) show(t);
  });

  document.addEventListener('mouseout', e => {
    if ('ontouchstart' in window) return;
    const t = e.target.closest('[data-title]');
    // Only hide when the cursor actually leaves the [data-title] element
    if (t && !t.contains(e.relatedTarget)) hide();
  });

  // Mobile — touch events (passive; does not prevent link navigation)
  document.addEventListener('touchstart', e => {
    const t = e.target.closest('[data-title]');
    if (t) {
      // Second tap on the same element dismisses the tooltip
      if (t === activeTarget && isVisible) { hide(); return; }
      show(t);
    } else if (isVisible) {
      hide();
    }
  }, { passive: true });

  // Exported so other components can sync tooltip text after mutating data-title in place.
  return {
    refresh(target) {
      if (target !== activeTarget || !isVisible) return;
      content.textContent = target.getAttribute('data-title');

      // Re-measure and instantly redraw border + reposition to match new content size
      requestAnimationFrame(() => {
        const w  = inner.offsetWidth;
        const h  = inner.offsetHeight;
        const cx = Math.round(w / 2);
        pathL.style.transition       = 'none';
        pathR.style.transition       = 'none';
        pathL.setAttribute('d', `M ${cx},0 H 0 V ${h} H ${cx}`);
        pathR.setAttribute('d', `M ${cx},0 H ${w} V ${h} H ${cx}`);
        const lenL = pathL.getTotalLength();
        const lenR = pathR.getTotalLength();
        pathL.style.strokeDasharray  = `${lenL}`;
        pathL.style.strokeDashoffset = '0';
        pathR.style.strokeDasharray  = `${lenR}`;
        pathR.style.strokeDashoffset = '0';
        dot.setAttribute('cx', cx);
        const tr   = target.getBoundingClientRect();
        let   left = tr.left + tr.width  / 2 - w / 2;
        let   top  = tr.bottom + 14;
        if (top + h + 14 > window.innerHeight) top = tr.top - h - 14;
        left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
        el.style.left = `${left}px`;
        el.style.top  = `${top}px`;
      });
    }
  };
}
