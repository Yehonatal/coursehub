import { test, expect } from '@playwright/test';

test('user can navigate dashboard and view analytics', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  // Check dashboard loads with stats
  await expect(page.getByRole('heading', { name: /dashboard|analytics/i })).toBeVisible();
  expect(await page.getByText(/resources|contributions|ai usage/i).count()).toBeGreaterThan(0);

  // Switch to university view (if tabbed)
  await page.getByRole('tab', { name: /university view/i }).click();
  await expect(page.getByRole('heading', { name: /university analytics/i })).toBeVisible();

  // Navigate to resources from dashboard
  await page.getByRole('link', { name: /resources|my uploads/i }).click();
  await expect(page).toHaveURL(/resources/);
});