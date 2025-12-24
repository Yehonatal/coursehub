import { test, expect } from '@playwright/test';

test('user can view a resource and generate AI flashcards', async ({ page }) => {
  await page.goto('http://localhost:3000/resources');

  // Click on the first or a specific resource card
  await page.getByRole('link', { name: /E2E Test Resource/i }).first().click();

  await expect(page.getByRole('heading', { name: /E2E Test Resource/i })).toBeVisible();

  // Test AI generation (flashcards)
await page.getByRole('button', { name: /generate flashcards|flashcards/i }).click();

// Wait for and check that flashcards were generated
expect(await page.getByText(/flashcard|question|answer/i).count()).toBeGreaterThan(0);

  // Optional: Add a comment
  await page.getByPlaceholder(/write a comment/i).fill('Great resource from E2E test!');
  await page.getByRole('button', { name: /post|submit comment/i }).click();
  await expect(page.getByText('Great resource from E2E test!')).toBeVisible();
});