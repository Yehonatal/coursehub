import { test, expect } from '@playwright/test';

test('user can search for a resource and view/enroll', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Use the search bar
  await page.getByPlaceholder(/search/i).fill('E2E Test Resource');
  await page.keyboard.press('Enter');

  // Wait for search results
  await expect(page.getByRole('heading', { name: /search results/i })).toBeVisible();

  // Click on the result
  await page.getByRole('link', { name: /E2E Test Resource/i }).click();

  // Should land on resource page
  await expect(page.getByRole('heading', { name: /E2E Test Resource/i })).toBeVisible();

  // Optional: Enroll if there's an enroll button (for courses)
  // await page.getByRole('button', { name: /enroll/i }).click();
  // await expect(page.getByText(/enrolled successfully/i)).toBeVisible();
});