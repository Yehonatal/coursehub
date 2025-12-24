import { test, expect } from '@playwright/test';

test('user can update profile and settings', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard'); // Or /profile

  // Go to profile/settings
  await page.getByRole('link', { name: /profile|settings/i }).click();

  // Update profile info
  await page.getByLabel(/full name|display name/i).fill('Updated E2E Test User');
  await page.getByLabel(/bio|description/i).fill('Updated bio from E2E test');

  // Toggle notifications or other settings
  await page.getByLabel(/email notifications/i).check();

  // Save changes
  await page.getByRole('button', { name: /save|update profile/i }).click();

  // Verify success and changes reflected
  await expect(page.getByText(/profile updated successfully/i)).toBeVisible();
  await expect(page.getByText('Updated E2E Test User')).toBeVisible();
});