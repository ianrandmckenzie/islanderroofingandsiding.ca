# Cloudflare Configuration

## Cache Rules

### Hashed Asset Bundles (`/assets/*`)

Vite content-hashes all filenames under `/assets/` (e.g. `main-BD0ocdNa.js`, `main-BOvYoB-s.css`). The hash changes whenever the file content changes, so these URLs are safe to cache indefinitely.

**Rule:**
- **Condition:** URI Path starts with `/assets/`
- **Edge TTL:** Override → 1 year
- **Browser TTL:** Override → 1 year
- **Cache status:** Eligible for cache

### `style.css`

If a `/style.css` is served at a stable, non-hashed path it should use a shorter TTL since the filename does not change between deploys.

**Rule:**
- **Condition:** URI Path equals `/style.css`
- **Edge TTL:** Override → 1 day
- **Browser TTL:** Override → 1 day
- **Cache status:** Eligible for cache

---

## Known Lighthouse Warnings — Do Nothing

### `StorageType.persistent` deprecation

Lighthouse may report:

> `StorageType.persistent` is deprecated. Please use standardized `navigator.storage` instead.
> Source: `islanderroofingandsiding.ca` 1st party

**Root cause:** Cloudflare is injecting a script at the edge (e.g. Rocket Loader or Zaraz) that calls the deprecated quota API. The warning is attributed to the 1st-party origin because the injection happens before the response reaches the browser.

**Resolution:** This is outside our control. The codebase contains no calls to `StorageType.persistent`, `webkitStorageInfo`, or any quota API — confirmed by source audit. If the warning needs to be eliminated, disable Rocket Loader / Zaraz in the Cloudflare dashboard. Otherwise, ignore it — it has no functional impact on the site.
