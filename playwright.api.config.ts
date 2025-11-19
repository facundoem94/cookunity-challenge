import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/api/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'artifacts/playwright-report/api', open: 'never' }],
    ['json', { outputFile: 'artifacts/results/api.json' }],
  ],
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  outputDir: 'artifacts/test-results/api',
  use: {
    baseURL: process.env.GOREST_BASE_URL || 'https://gorest.co.in/public/v1',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      ...(process.env.GOREST_TOKEN
        ? { Authorization: `Bearer ${process.env.GOREST_TOKEN}` }
        : {}),
    },
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: ['**/api/**/*.spec.ts'],
    },
  ],
});


