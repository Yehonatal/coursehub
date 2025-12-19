import { test, expect } from '@playwright/test';
import path from 'path';

test('user can upload a course resource', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Go to course resources page
  await page.goto('http://localhost:3000/courses/1/resources');

  // Upload a file
  const filePath = path.resolve(__dirname, 'sample-resource.pdf'); // make sure this file exists
  await page.setInputFiles('input[type="file"]', filePath);

  // Submit the upload
  await page.click('button[type="submit"]');

  // Confirm upload success
  await expect(page.locator('text=Resource uploaded successfully')).toBeVisible();
});
