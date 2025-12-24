import { test, expect } from '@playwright/test';

test('new user can register successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByLabel(/full name/i).fill('E2E Test User');
  await page.getByLabel('Email').fill(`test-${Date.now()}@example.com`); // Unique email
  await page.getByLabel('Password').fill('StrongPass123!');

  await page.getByRole('button', { name: /sign up|register/i }).click();

  // Should be redirected after successful registration
  await expect(page).toHaveURL(/dashboard|home/);
  await expect(page.getByText(/welcome|dashboard/i)).toBeVisible();
});