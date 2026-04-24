#!/usr/bin/env node
/**
 * bake-components.js
 * Post-build script: injects static nav HTML into every built HTML file under
 * docs/ so the browser never has to wait for JS to paint the shell.
 *
 * Interactivity (theme toggle, mobile menu) is still wired up by the existing
 * JS components, which detect the pre-rendered elements and skip creation.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'glob';
const { sync: globSync } = pkg;
import { renderThemeToggleButton } from '../src/components/theme-toggle.js';
import { renderNavInnerHtml } from '../src/components/nav.js';
import { renderFooterHtml } from '../src/components/footer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir   = resolve(__dirname, '..', 'docs');

// ---------------------------------------------------------------------------
// SVG icons (kept in sync with src/components/nav.js)
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/notes', label: 'Areas' },
  { href: '/articles', label: 'Knowledge' },
  { href: '/case-studies', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/request-a-quote', label: 'Contact' },
];

function buildNavHtml(filename) {
  const slug = filename.replace(/\.html$/, '');
  const currentPath = slug === 'index' || slug === '' ? '/' : `/${slug}`;
  return `<header id="site-header" class="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl dark:border-slate-800 dark:bg-black/92">${renderNavInnerHtml(currentPath)}</header>`;
}

const SECTION_LABELS = {
  'services':     'Services',
  'notes':        'Areas',
  'articles':     'Knowledge',
  'case-studies': 'Gallery',
  'about':        'About',
  'request-a-quote': 'Contact',
};

function buildBreadcrumbHtml(rel, htmlContent) {
  if (rel.startsWith('html/') || rel.startsWith('html\\')) return '';

  const labelMatch = htmlContent.match(/<meta\s+name="bc-label"\s+content="([^"]+)"/);
  const currentLabel = labelMatch?.[1] ?? 'Home';

  const urlPath  = '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\\/g, '/');
  const segments = urlPath.replace(/^\//, '').split('/').filter(Boolean);

  const crumbs = [{ label: 'Home', href: '/' }];
  for (let i = 0; i < segments.length; i++) {
    const seg    = segments[i];
    const isLast = i === segments.length - 1;
    if (isLast) {
      crumbs.push({ label: currentLabel });
    } else {
      crumbs.push({ label: SECTION_LABELS[seg] ?? seg, href: '/' + segments.slice(0, i + 1).join('/') });
    }
  }

  const items = crumbs.map((crumb, i) => {
    if (i === crumbs.length - 1) {
      return `<li aria-current="page"><span class="text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase tracking-widest">${crumb.label}</span></li>`;
    }
    return `<li><a href="${crumb.href}" class="text-slate-600 dark:text-slate-300 hover:text-primary font-mono text-[10px] uppercase tracking-widest transition-colors">${crumb.label}</a></li><li aria-hidden="true" class="text-slate-400 dark:text-slate-700 font-mono text-[10px] select-none">/</li>`;
  }).join('');

  return `<nav id="site-breadcrumbs" aria-label="Breadcrumb" class="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-black/80"><div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2.5 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between"><ol class="flex items-center gap-2 flex-wrap" role="list">${items}</ol><div class="flex items-center justify-end">${renderThemeToggleButton('light', 'shrink-0')}</div></div></nav>`;
}

// ---------------------------------------------------------------------------
function buildFooterHtml(filename) {
  return `<footer id="site-footer" class="mt-auto border-t border-slate-200/80 bg-white/96 dark:border-slate-800 dark:bg-black/96">${renderFooterHtml()}</footer>`;
}

// ---------------------------------------------------------------------------
// Process a single HTML file
// ---------------------------------------------------------------------------
function processFile(filePath) {
  let html = readFileSync(filePath, 'utf8');

  // Skip if already baked (idempotent)
  if (html.includes('id="site-header"') || html.includes("id='site-header'")) {
    console.log(`  skip (already baked): ${relative(docsDir, filePath)}`);
    return;
  }

  const rel              = relative(docsDir, filePath);            // e.g. "articles/zero-trust-…html"
  const parts            = rel.split(/[/\\]/);
  const filename         = parts[parts.length - 1];               // e.g. "zero-trust-…html"
  const isArticlesSubdir = parts.length > 1 && parts[0] === 'articles';

  const navHtml        = buildNavHtml(filename, isArticlesSubdir);
  const breadcrumbHtml = buildBreadcrumbHtml(rel, html);
  const footerHtml     = buildFooterHtml(filename);

  // Pre-set body padding-top to nav height (~68px) to prevent CLS before JS initialises
  html = html.replace(/(<body\b)([^>]*)(>)/, (_, open, attrs, close) => {
    if (/\bstyle=/.test(attrs)) {
      return `${open}${attrs.replace(/style="/, 'style="padding-top:68px;')}${close}`;
    }
    return `${open}${attrs} style="padding-top:68px"${close}`;
  });

  // Insert nav (+ breadcrumbs where applicable) right after <body …>
  const afterBody = breadcrumbHtml
    ? `\n${navHtml}\n${breadcrumbHtml}`
    : `\n${navHtml}`;
  html = html.replace(/(<body[^>]*>)/, `$1${afterBody}`);

  // Insert footer right before </body>
  html = html.replace(/<\/body>/, `${footerHtml}\n</body>`);

  writeFileSync(filePath, html, 'utf8');
  console.log(`  baked: ${relative(docsDir, filePath)}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const files = globSync('**/*.html', { cwd: docsDir, absolute: true });
console.log(`\nBaking nav into ${files.length} HTML file(s) in docs/…`);
files.forEach(processFile);
console.log('Done.\n');
