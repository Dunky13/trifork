const { test, expect } = require('@playwright/test');

const fixtureConfig = {
  technology: ['First', 'Second', 'Third', 'Fourth'], shuffle: false,
  username: 'test', password: 'fixture', storageLocation: '/test-submission',
};

test('renders the existing survey and submits its existing API payload', async ({ page }) => {
  await page.route('**/assets/config.json', route => route.fulfill({ json: fixtureConfig }));
  let received;
  await page.route('**/test-submission', async route => {
    received = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('header')).toContainText('game-changing');
  await expect(page.locator('header')).toContainText('(Choose 2)');
  const choices = page.getByRole('checkbox');
  await expect(choices).toHaveCount(4);
  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(submit).toBeDisabled();
  await page.locator('md-checkbox').nth(0).click();
  await expect(choices.nth(0)).toBeChecked();
  await expect(choices.nth(1)).toBeDisabled();
  await page.locator('md-checkbox').nth(3).click();
  await expect(choices.nth(3)).toBeChecked();
  await page.getByPlaceholder('Name', { exact: true }).fill('Test User');
  await page.getByPlaceholder('Email Address').fill('test@example.invalid');
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect.poll(() => received).toMatchObject({
    email_address: 'test@example.invalid', name: 'Test User', technology: ['First', 'Fourth'],
  });
  expect(typeof received.datetime).toBe('number');
  await expect(page.getByPlaceholder('Name', { exact: true })).toHaveValue('');
  await expect(submit).toBeDisabled();
});

test('keeps the survey usable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/assets/config.json', route => route.fulfill({ json: fixtureConfig }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('header')).toContainText('game-changing');
  await expect(page.getByRole('checkbox')).toHaveCount(4);
  await expect(page.getByPlaceholder('Email Address')).toBeVisible();
});

test('preserves offline navigation after the service worker activates', async ({ page, context }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  page.on('console', message => { if (message.type() === 'error') console.error(message.text()); });
  await expect.poll(async () => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).map(item => ({ scope: item.scope, active: item.active && item.active.state, installing: item.installing && item.installing.state })))).not.toEqual([]);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  try {
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('header')).toContainText('game-changing');
  } finally {
    await context.setOffline(false);
  }
});
