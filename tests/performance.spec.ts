import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('Products page loads within an acceptable time budget', async ({ page }) => {
    const start = Date.now();
    const response = await page.goto('/products', { waitUntil: 'load' });
    const totalLoadTime = Date.now() - start;

    expect(response?.status()).toBeLessThan(400);
    // Wall-clock budget - recalibrate against a measured baseline for your CI runner.
    expect(totalLoadTime).toBeLessThan(3000);

    const navigationTiming = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      return {
        ttfb: entry.responseStart - entry.requestStart,
        domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
        fullLoad: entry.loadEventEnd - entry.startTime,
      };
    });

    expect(navigationTiming.ttfb).toBeLessThan(800);
    expect(navigationTiming.domContentLoaded).toBeLessThan(2000);
    expect(navigationTiming.fullLoad).toBeLessThan(3000);
  });

  test('the "Add to cart" interaction responds within budget', async ({ page }) => {
    await page.goto('/products');
    const addButton = page.getByRole('button', { name: 'Add to cart' }).first();

    const start = Date.now();
    await addButton.click();
    await page.getByRole('link', { name: /^Cart/ }).click();
    await expect(page.getByText('Your cart is empty')).not.toBeVisible();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(1500);
  });
});
