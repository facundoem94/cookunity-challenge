import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly orderCheckoutButton = 'button:has-text("Order Checkout")';

  async placeOrder(): Promise<void> {
    await this.page.locator(this.orderCheckoutButton).first().click();
  }
}


