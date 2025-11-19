import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
  await this.page.goto('/login');
  await this.page.getByRole('textbox', { name: 'Email' }).first().fill(email);
  await this.page.getByRole('textbox', { name: 'Password' }).first().fill(password);
  await this.page.getByRole('button', { name: 'Sign In' }).first().click();
  await expect(this.page.locator('[data-cy="account-page"]')).toBeVisible({timeout: 30000});
  }
}


