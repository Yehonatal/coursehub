import { test, expect } from '@playwright/test';

test('user can update profile information', async ({ page }) => {
  // Go to login page
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Ensure login succeeded
  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Navigate to profile page
  await page.goto('http://localhost:3000/profile');

  // Update profile info
  await page.fill('input[name="fullName"]', 'Test User Updated');
  await page.fill('input[name="bio"]', 'This is a new bio for testing.');
  await page.click('button[type="submit"]');

  // Confirm profile update success
  await expect(page.locator('text=Profile updated successfully')).toBeVisible();
});
