import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authDir = path.resolve(__dirname, '../playwright/.auth');
const authFile = path.resolve(authDir, 'user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(authDir, { recursive: true });

  const baseURL = process.env.CU_BASE_URL || 'https://app.business.qa.cookunity.com';
  const email = process.env.CU_EMAIL || '';
  const password = process.env.CU_PASSWORD || '';

  await page.goto(`${baseURL}/login`);

  const emailField = page.locator('input[name="email"], input[type="email"]');
  const passwordField = page.locator('input[name="password"], input[type="password"]');
  const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")');

  if (await emailField.count()) {
    await emailField.first().fill(email);
  }
  if (await passwordField.count()) {
    await passwordField.first().fill(password);
  }
  if (await submitButton.count()) {
    await submitButton.first().click();
  }

  // Wait until we are no longer on the login page and user session is established
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/\/login(\?|$)/);

  await page.context().storageState({ path: authFile });
});


