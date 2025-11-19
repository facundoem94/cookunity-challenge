import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'artifacts/playwright-report/frontend', open: 'never' }],
    ['json', { outputFile: 'artifacts/results/frontend.json' }],
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  outputDir: 'artifacts/test-results/frontend',
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.CU_BASE_URL || 'https://app.business.qa.cookunity.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    }
  ],
});
