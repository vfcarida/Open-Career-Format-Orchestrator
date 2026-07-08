import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/OCF Orchestrator/);
});

test('approval queue renders', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Approval Queue');
  await expect(page.locator('h1')).toContainText('Approval Queue');
});
