import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authDir = path.resolve(__dirname, '../playwright/.auth');
const authFile = path.resolve(authDir, 'user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(authDir, { recursive: true });

  const email = process.env.CU_EMAIL || '';
  const password = process.env.CU_PASSWORD || '';

  expect(email.trim(), 'CU_EMAIL must be set').toBeTruthy();
  expect(password.trim(), 'CU_PASSWORD must be set').toBeTruthy();

  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).first().fill(email);
  await page.getByRole('textbox', { name: 'Password' }).first().fill(password);
  await page.getByRole('button', { name: 'Sign In' }).first().click();

  await expect(page.locator('[data-cy="account-page"]')).toBeVisible({timeout: 30000});

  await page.context().storageState({ path: authFile });
});


