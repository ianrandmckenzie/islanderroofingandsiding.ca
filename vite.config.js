// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// Moves Vite-injected CSS links to before any <script> tags and adds an early
// <link rel="preload"> hint so the browser discovers CSS during the first HTML
// parse pass instead of after the JS chunk has started loading.
function cssBeforeJsPlugin() {
  return {
    name: 'css-before-js',
    enforce: 'post',
    transformIndexHtml(html) {
      const cssLinkRegex = /<link rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/g
      const jsScriptRegex = /<script type="module"[^>]+src="(\/assets\/[^"]+\.js)"[^>]*>/g
      const links = []
      const scripts = []
      let m
      while ((m = cssLinkRegex.exec(html)) !== null) {
        links.push({ full: m[0], href: m[1], crossorigin: m[0].includes('crossorigin') })
      }
      while ((m = jsScriptRegex.exec(html)) !== null) {
        scripts.push({ href: m[1], crossorigin: m[0].includes('crossorigin') })
      }
      if (!links.length && !scripts.length) return html

      // Remove CSS links from their late injected position
      for (const { full } of links) html = html.replace(full, '')

      // Build preload hints for CSS (must carry crossorigin to avoid double-fetch)
      const cssPreloads = links
        .map(({ href, crossorigin }) =>
          `    <link rel="preload" as="style"${crossorigin ? ' crossorigin' : ''} href="${href}">`)
        .join('\n')

      // Build modulepreload hints for JS (browser starts fetching the module graph immediately)
      const jsPreloads = scripts
        .map(({ href, crossorigin }) =>
          `    <link rel="modulepreload"${crossorigin ? ' crossorigin' : ''} href="${href}">`)
        .join('\n')

      // Re-insert stylesheet tags before the first <script> in <head>
      const sheets = links.map(({ full }) => `    ${full.trim()}`).join('\n')

      // Add all preloads right after <meta charset> (earliest safe position)
      const allPreloads = [cssPreloads, jsPreloads].filter(Boolean).join('\n')
      html = html.replace(/(<meta charset="[^"]*"[^>]*>)/, `$1\n${allPreloads}`)

      // Insert stylesheets before the first <script> (inline theme script or module)
      html = html.replace(/(\s*)(<script[\s>])/, `\n${sheets}\n$1$2`)

      return html
    },
  }
}

// Recursively find all HTML files, excluding specified directories
function findHtmlFiles(dir, excludeDirs = ['node_modules']) {
  const results = []
  for (const entry of readdirSync(dir)) {
    if (excludeDirs.includes(entry)) continue
    const fullPath = `${dir}/${entry}`
    if (statSync(fullPath).isDirectory()) {
      results.push(...findHtmlFiles(fullPath, excludeDirs))
    } else if (entry.endsWith('.html')) {
      results.push(fullPath)
    }
  }
  return results
}

const input = Object.fromEntries(
  findHtmlFiles('src').map((file) => {
    // Strip leading "src/" and trailing ".html" to form a stable key
    const key = file.replace(/^src\//, '').replace(/\.html$/, '').replace(/\//g, '-')
    return [key, resolve(file)]
  })
)

export default defineConfig({
  root: 'src',
  plugins: [tailwindcss(), cssBeforeJsPlugin()],
  build: {
    outDir: '../docs',
    emptyOutDir: false, // Don't empty the docs directory to preserve existing files like CNAME
    rollupOptions: { input },
  },
  publicDir: '../public', // Ensure public files are copied
})
