import { test, expect } from '@playwright/test';

test('user can browse and select universities', async ({ page }) => {
  await page.goto('http://localhost:3000/resources'); // Or universities page

  // Open university selector (combobox)
  await page.getByRole('combobox', { name: /university|select university/i }).click();

  // Search and select a university (fuzzy matching)
  await page.getByRole('option', { name: /Addis Ababa|Harvard/i }).first().click(); // Adjust to real uni

  // View university dashboard/resources
  await expect(page.getByRole('heading', { name: /university dashboard|resources/i })).toBeVisible();
  expect(await page.getByRole('listitem').count()).toBeGreaterThan(0); // Resources list
});