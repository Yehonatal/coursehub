import { test, expect } from '@playwright/test';

test('authenticated user can upload a resource', async ({ page }) => {
  // Navigate to dashboard (adjust if your dashboard URL is different)
  await page.goto('http://localhost:3000/dashboard');

  // Updated selector – try these common variations
  // Option 1: Common in your app (from repo structure)
  await page.getByRole('button', { name: /upload resource/i }).click();
  // OR
  // await page.getByRole('button', { name: 'Upload' }).click();
  // OR
  // await page.getByRole('button', { name: 'Add Resource' }).click();

  // Fill the form (adjust labels if needed)
  await page.getByLabel(/title/i).fill('E2E Test Resource');
  await page.getByLabel(/description/i).fill('Uploaded via Playwright E2E test');

  // File upload – creates a virtual file
  await page.getByLabel(/file|upload file|choose file/i).setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('This is a test file content for E2E upload'),
  });

  await page.getByRole('button', { name: /submit|upload|create/i }).click();

  // Success assertion (adjust to your app's success message)
  await expect(page.getByText(/uploaded successfully|resource created|success/i)).toBeVisible();
});