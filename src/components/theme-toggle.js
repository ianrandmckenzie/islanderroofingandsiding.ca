const THEME_ICONS = {
  light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="w-5 h-5" aria-hidden="true">
    <path class="fa-dt-secondary" d="M215.8 320C258.2 334.1 284.2 342.8 294 346.1C297.2 355.8 305.9 381.9 320.1 424.3C334.2 381.9 342.9 355.9 346.2 346.1C355.9 342.9 382 334.2 424.4 320C382 305.9 356 297.2 346.2 293.9C343 284.2 334.3 258.1 320.1 215.7C306 258.1 297.3 284.1 294 293.9C284.3 297.1 258.2 305.8 215.8 320z"/>
    <path class="fa-dt-primary" d="M301.5 368.8L320 424.2C334.1 381.8 342.8 355.8 346.1 346C355.8 342.8 381.9 334.1 424.3 319.9C381.9 305.8 355.9 297.1 346.1 293.8C342.9 284.1 334.2 258 320 215.6C305.9 258 297.2 284 293.9 293.8C284.2 297 258.1 305.7 215.7 319.9C258.1 334 284.1 342.7 293.9 346L301.5 368.8zM256 384C171.9 356 107.9 334.6 64 320C107.9 305.4 171.9 284 256 256C284 171.9 305.4 107.9 320 64C334.6 107.9 356 171.9 384 256C468.1 284 532.1 305.4 576 320C532.1 334.6 468.1 356 384 384C356 468.1 334.6 532.1 320 576C305.4 532.1 284 468.1 256 384zM118.1 152L152 118.1C158.1 124.2 179.8 145.9 217 183.1L234 200.1L200.1 234C194 227.9 172.3 206.2 135.1 169L118.1 152zM522 152C515.9 158.1 494.2 179.8 457 217L440 234L406.1 200.1C412.2 194 433.9 172.3 471.1 135.1L488.1 118.1L522 152zM505 471L522 488L488.1 521.9C482 515.8 460.3 494.1 423.1 456.9L406.1 439.9L440 406C446.1 412.1 467.8 433.8 505 471zM118.1 488C124.2 481.9 145.9 460.2 183.1 423L200.1 406L234 439.9C227.9 446 206.2 467.7 169 504.9L152 521.9L118.1 488z"/>
  </svg>`,
  dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="w-5 h-5" aria-hidden="true">
    <path class="fa-dt-secondary" d="M112 320C112 434.9 205.1 528 320 528C345.5 528 370 523.4 392.6 515C294.6 481.9 224 389.2 224 280C224 216.4 247.9 158.4 287.2 114.6C187.9 130.3 112 216.3 112 320z"/>
    <path class="fa-dt-primary" d="M423.7 85.9C400 75.3 374.4 68.3 347.5 65.5C338.5 64.5 329.3 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C375.7 576 427.3 558.2 469.3 528C470.2 527.3 471.1 526.7 472 526C492.3 511 510.3 493 525.4 472.8C508.4 477.5 490.5 480 472 480C465.9 480 459.9 479.7 453.9 479.2C351.9 470 272 384.4 272 280C272 211.8 306.1 151.6 358.2 115.5C377.8 101.9 399.9 91.8 423.7 85.9zM287.2 114.6C247.9 158.5 224 216.4 224 280C224 389.2 294.6 481.9 392.6 515C370 523.4 345.6 528 320 528C205.1 528 112 434.9 112 320C112 216.3 187.9 130.3 287.2 114.6z"/>
  </svg>`,
};

const THEME_LABELS = { light: 'Light', dark: 'Dark' };

export function getThemeLabel(pref) {
  return THEME_LABELS[pref] ?? (pref === 'dark' ? 'Dark' : 'Light');
}

export function renderThemeToggleButton(theme = 'light', extraClasses = '') {
  const className = ['rounded-full border border-slate-200 p-2 text-secondary transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-slate-800', extraClasses].filter(Boolean).join(' ');
  const label = getThemeLabel(theme);

  return `<button id="theme-toggle" aria-label="Switch theme: currently ${label}" title="Theme: ${label}" data-title="Theme: ${label}" type="button" class="${className}">${THEME_ICONS[theme] ?? THEME_ICONS.light}</button>`;
}

export { THEME_ICONS };
