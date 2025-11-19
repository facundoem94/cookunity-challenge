import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly emailInput = 'input[name="email"], input[type="email"]';
  private readonly passwordInput = 'input[name="password"], input[type="password"]';
  private readonly submitButton = 'button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")';

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.locator(this.emailInput).first().fill(email);
    await this.page.locator(this.passwordInput).first().fill(password);
    await this.page.locator(this.submitButton).first().click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).not.toHaveURL(/\/login$/);
  }
}


