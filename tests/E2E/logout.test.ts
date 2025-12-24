import { test, expect } from '@playwright/test';

test('user can logout and premium features are gated', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard'); // Assume logged in

  // Test premium gate (e.g., AI button locked)
  await page.getByRole('button', { name: /generate ai|premium/i }).click();
  await expect(page.getByText(/upgrade|premium|subscribe/i)).toBeVisible(); // PremiumLock component

  // Logout
  await page.getByRole('button', { name: /logout|sign out/i }).click();

  // Redirected to login/home, session cleared
  await expect(page).toHaveURL(/login|home/);
  await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible();

  // Protected page inaccessible
  await page.goto('http://localhost:3000/dashboard');
  await expect(page.getByText(/sign in|log in/i)).toBeVisible();
});