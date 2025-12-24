import { test, expect } from '@playwright/test';

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Fill login form (adjust selectors if your form is different)
  await page.getByLabel(/email/i).fill('test@example.com'); // Use your test user email
  await page.getByLabel(/password/i).fill('password123');   // Use your test password
  await page.getByRole('button', { name: /sign in|login/i }).click();

  // Assert successful login - redirected to dashboard or home
  await expect(page).toHaveURL(/dashboard|home/);
  await expect(page.getByRole('heading', { name: /dashboard|welcome/i })).toBeVisible();
});