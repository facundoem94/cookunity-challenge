import fs from 'fs';
import path from 'path';
import { type Browser } from '@playwright/test';

const STORAGE_DIR = path.resolve(__dirname, '../../.auth');
const STORAGE_FILE = path.join(STORAGE_DIR, 'storageState.json');

export async function ensureAuthState(browser: Browser): Promise<string> {
  if (fs.existsSync(STORAGE_FILE)) {
    return STORAGE_FILE;
  }
  fs.mkdirSync(STORAGE_DIR, { recursive: true });

  const baseURL = process.env.CU_BASE_URL || 'https://app.business.qa.cookunity.com';
  const email = process.env.CU_EMAIL || '';
  const password = process.env.CU_PASSWORD || '';

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });

  // KISS: try common form field names; adjust as needed for the real app
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

  await page.waitForLoadState('networkidle');
  // Heuristic: consider logged in if we are not on /login
  if (page.url().includes('/login')) {
    // Some apps redirect to home after a short delay
    await page.waitForTimeout(1500);
  }

  await context.storageState({ path: STORAGE_FILE });
  await context.close();
  return STORAGE_FILE;
}


