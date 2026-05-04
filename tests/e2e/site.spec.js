import { expect, test } from '@playwright/test';

test.describe('site shell', () => {
  test('renders the home page and persists the theme toggle', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('theme-preference', 'dark');
    });

    await page.reload();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByRole('heading', { name: /roofing and siding built for wind, salt, and humidity/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /browse the area hub/i })).toBeVisible();
    const phoneLink = page.locator('a[href="tel:17785857866"]');
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toContainText(/call now/i);
    await expect(page.locator('#site-breadcrumbs')).toBeVisible();
    await expect(page.locator('#site-breadcrumbs #theme-toggle')).toBeVisible();
    await expect(page.locator('#site-header #theme-toggle')).toHaveCount(0);

    await page.getByRole('button', { name: /switch theme/i }).click();

    await expect(html).not.toHaveClass(/dark/);

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('opens the mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const mobileMenu = page.locator('#nav-mobile-menu');
    const phoneLink = page.locator('[data-mobile-phone]');
    const mobileBrand = page.locator('[data-mobile-brand]');
    await expect(mobileMenu).toBeHidden();
    await expect(mobileBrand).toBeVisible();
    await expect(phoneLink).toBeVisible();

    const brandBox = await mobileBrand.boundingBox();
    const phoneBox = await phoneLink.boundingBox();

    expect(brandBox).not.toBeNull();
    expect(phoneBox).not.toBeNull();
    expect(phoneBox.y).toBeGreaterThan(brandBox.y + brandBox.height - 1);

    await page.getByRole('button', { name: /open menu/i }).click();

    await expect(mobileMenu).toBeVisible();
    await page.getByRole('button', { name: /close menu/i }).click();
    await expect(mobileMenu).toBeHidden();
  });

  test('navigates from the home page to the knowledge page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /knowledge/i }).first().click();

    await expect(page).toHaveURL(/\/articles(\.html)?$/);
    await expect(page.getByRole('heading', { name: /practical roofing and siding guidance for mid-island homes/i })).toBeVisible();
  });
});

test.describe('area briefs', () => {
  test('service areas hub links to the first launch pages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/areas');

    await expect(page.getByRole('heading', { name: /find the page that matches the home you are looking at/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /salt-resistant metal roofing for crown isle homes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /roof flashing repair for coastal homes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /moss removal and cedar treatment for shaded roofs/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /durable roofing for village homes and easy maintenance/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /wind damaged shingle repair for exposed homes/i })).toBeVisible();

    await page.getByRole('link', { name: /salt-resistant metal roofing for crown isle homes/i }).click();

    await expect(page).toHaveURL(/\/crown-isle(\.html)?$/);
    await expect(page.getByRole('heading', { name: /salt-resistant metal roofing for crown isle homes/i })).toBeVisible();
    await expect(page.locator('[data-area-page="crown-isle"]')).toBeVisible();

    const schema = await page.locator('script[type="application/ld+json"]').first().evaluate(node => JSON.parse(node.textContent));
    expect(JSON.stringify(schema)).toContain('Crown Isle');
    expect(JSON.stringify(schema)).toContain('Courtenay');
  });

  test('Cumberland page frames durable village housing needs', async ({ page }) => {
    await page.goto('/cumberland');

    await expect(page.getByRole('heading', { name: /durable roofing for cumberland homes that need easy maintenance/i })).toBeVisible();
    await expect(page.locator('[data-area-page="cumberland"]')).toBeVisible();

    const schema = await page.locator('script[type="application/ld+json"]').first().evaluate(node => JSON.parse(node.textContent));
    expect(JSON.stringify(schema)).toContain('Cumberland');
    expect(JSON.stringify(schema)).toContain('Roof replacement');
  });

  test('Comox Peninsula page frames the emergency leak intent', async ({ page }) => {
    await page.goto('/comox-peninsula');

    await expect(page.getByRole('heading', { name: /roof flashing repair for comox peninsula homes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /request leak triage/i })).toBeVisible();
    await expect(page.locator('[data-area-page="comox-peninsula"]')).toBeVisible();
  });

  test('Aberdeen Heights and Royston pages cover maintenance and wind exposure', async ({ page }) => {
    await page.goto('/aberdeen-heights');

    await expect(page.getByRole('heading', { name: /moss removal and cedar roof treatment for aberdeen heights homes/i })).toBeVisible();
    await expect(page.locator('[data-area-page="aberdeen-heights"]')).toBeVisible();

    await page.goto('/royston-union-bay');

    await expect(page.getByRole('heading', { name: /wind damaged shingle repair for royston and union bay homes/i })).toBeVisible();
    await expect(page.locator('[data-area-page="royston-union-bay"]')).toBeVisible();
  });
});

test.describe('component coverage', () => {
  test('breadcrumb trails render on non-home pages', async ({ page }) => {
    await page.goto('/services');

    const breadcrumbs = page.locator('#site-breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumbs.locator('[aria-current="page"]')).toHaveText('Services');
  });

  test('footer content renders on content pages', async ({ page }) => {
    await page.goto('/services');

    await expect(page.locator('#site-footer')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' }).last()).toBeVisible();
    await expect(page.locator('#site-footer').getByRole('link', { name: /1 \(778\) 585-7866/i })).toBeVisible();
    await expect(page.locator('#site-footer').getByRole('link', { name: /contact@islanderroofingandsiding\.ca/i })).toBeVisible();
  });

  test('search filtering narrows the knowledge feed and shows the empty state', async ({ page }) => {
    await page.goto('/articles');

    const search = page.locator('#knowledge-search');
    const count = page.locator('#knowledge-count');
    const emptyState = page.locator('#knowledge-empty');
    const items = page.locator('#knowledge-feed [data-ui-filter-item]');

    await search.fill('salt');
    await expect(count).toHaveText('1 result');
    await expect(items.nth(0)).toBeVisible();
    await expect(items.nth(1)).toBeHidden();
    await expect(items.nth(2)).toBeHidden();

    await search.fill('zzz');
    await expect(count).toHaveText('0 results');
    await expect(emptyState).toBeVisible();
    await expect(items.nth(0)).toBeHidden();
  });

  test('contact scope guide opens and closes from the request a quote page', async ({ page }) => {
    await page.goto('/request-a-quote');

    const contactDetails = page.locator('article').filter({ has: page.getByRole('heading', { name: /prompt, clear, and local/i }) });
    const launchModal = page.getByRole('button', { name: /open scope guide/i });
    const modal = page.locator('#scope-guide');
    const closeButton = modal.getByRole('button', { name: /close modal/i });

    await expect(contactDetails.getByRole('link', { name: /call 1 \(778\) 585-7866/i })).toBeVisible();
    await expect(contactDetails.getByRole('link', { name: /contact@islanderroofingandsiding\.ca/i })).toBeVisible();

    await launchModal.click();
    await expect(modal).toBeVisible();
    await expect(closeButton).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(modal).toBeHidden();
  });

  test('quote calculator reveals a planning range after an email is entered', async ({ page }) => {
    await page.goto('/request-a-quote');

    const calculator = page.locator('[data-ui-estimate-calculator]');

    await calculator.getByLabel(/project type/i).selectOption('roof-replacement');
    await calculator.locator('[data-ui-estimate-size-unit]').selectOption('sqm');
    await calculator.getByLabel(/site profile/i).selectOption('steep');
    await calculator.getByLabel(/timing/i).selectOption('soon');
    await calculator.locator('[data-ui-estimate-age]').selectOption('11-15');
    await calculator.locator('[data-ui-estimate-notes]').fill('Please include chimney flashing, gutter notes, and access limitations.');
    await calculator.locator('[data-ui-estimate-images]').setInputFiles({
      name: 'roof-detail.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake roof image data'),
    });
    await calculator.locator('[data-ui-estimate-email]').fill('homeowner@example.com');
    await calculator.getByRole('button', { name: /reveal my range/i }).click();

    await expect(calculator.locator('[data-ui-estimate-range]')).toContainText(/\$/);
    await expect(calculator.getByRole('status')).toContainText(/range ready for homeowner@example.com/i);
    await expect(page.getByRole('heading', { name: /details that make the estimate believable/i })).toBeVisible();
  });

  test('quote calculator draft persists locally after a reload', async ({ page }) => {
    await page.goto('/request-a-quote');

    const calculator = page.locator('[data-ui-estimate-calculator]');

    await calculator.getByLabel(/project type/i).selectOption('siding-replacement');
    await calculator.locator('[data-ui-estimate-size-unit]').selectOption('sqm');
    await calculator.getByLabel(/site profile/i).selectOption('coastal');
    await calculator.getByLabel(/timing/i).selectOption('urgent');
    await calculator.locator('[data-ui-estimate-age]').selectOption('21-plus');
    await calculator.locator('[data-ui-estimate-notes]').fill('Need to keep the old trim profile and confirm storm damage at the west wall.');
    await calculator.locator('[data-ui-estimate-images]').setInputFiles({
      name: 'west-wall.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake west wall image data'),
    });
    await calculator.locator('[data-ui-estimate-email]').fill('homeowner@example.com');

    await page.reload();

    await expect(calculator.locator('[data-ui-estimate-project]')).toHaveValue('siding-replacement');
    await expect(calculator.locator('[data-ui-estimate-size-unit]')).toHaveValue('sqm');
    await expect(calculator.locator('[data-ui-estimate-size]')).toHaveValue('204.4');
    await expect(calculator.locator('[data-ui-estimate-profile]')).toHaveValue('coastal');
    await expect(calculator.locator('[data-ui-estimate-timeline]')).toHaveValue('urgent');
    await expect(calculator.locator('[data-ui-estimate-age]')).toHaveValue('21-plus');
    await expect(calculator.locator('[data-ui-estimate-email]')).toHaveValue('homeowner@example.com');
    await expect(calculator.locator('[data-ui-estimate-notes]')).toHaveValue('Need to keep the old trim profile and confirm storm damage at the west wall.');
    await expect(calculator.locator('[data-ui-estimate-images-summary]')).toContainText(/west-wall\.jpg/i);

    await calculator.getByRole('button', { name: /reveal my range/i }).click();
    await expect(calculator.locator('[data-ui-estimate-range]')).toContainText(/\$/);
    await expect(calculator.getByRole('status')).toContainText(/range ready for homeowner@example.com/i);
  });

  test('tooltips appear for title-bearing controls', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme-preference', 'dark');
    });

    await page.goto('/');

    await page.locator('#theme-toggle').hover();

    await expect(page.locator('#site-tooltip')).toBeVisible();
    await expect(page.locator('#tt-content')).toHaveText(/Theme: Dark/);
  });
});
