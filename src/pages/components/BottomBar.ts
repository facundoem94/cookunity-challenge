import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BottomBar extends BasePage {
  
  constructor(page: Page) {
    super(page);
  }

  private readonly checkoutButton = 'button:has-text("Order Checkout")';

  async revealAndCheckout(): Promise<void> {
    const btn = this.page.locator(this.checkoutButton).first();
    await btn.scrollIntoViewIfNeeded();
    await this.page.hover('body');
    await btn.click();
  }
}


