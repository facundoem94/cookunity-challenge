import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly orderCheckoutButton = '[data-cy="button-create-order"]';

  async orderCheckout(): Promise<void> {
    await this.page.locator(this.orderCheckoutButton).first().click();
  }
}


