// tests/e2e/course-enroll.test.ts
import { test, expect } from '@playwright/test';

test('user can search for a course and enroll', async ({ page }) => {
  // Go to the home page
  await page.goto('http://localhost:3000');

  // Login first (if not already logged in)
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Ensure login succeeded
  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Navigate to courses page
  await page.goto('http://localhost:3000/courses');

  // Search for a course
  await page.fill('input[placeholder="Search courses"]', 'Mathematics');
  await page.click('button[type="submit"]');

  // Ensure search results appear
  await expect(page.locator('text=Mathematics')).toBeVisible();

  // Click enroll button for the first course
  await page.click('text=Enroll');

  // Confirm enrollment success
  await expect(page.locator('text=You are enrolled in Mathematics')).toBeVisible();
});
