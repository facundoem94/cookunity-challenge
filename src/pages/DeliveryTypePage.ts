import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeliveryTypePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly homeDeliveryOption =
    'label:has-text("Delivery to a home"), [role="radio"]:has-text("Delivery to a home")';
  private readonly continueButton = 'button:has-text("Continue")';

  async chooseHomeDelivery(): Promise<void> {
    // Some UIs use label wrapping an input, others are radios
    const option = this.page.locator(this.homeDeliveryOption).first();
    if (await option.getAttribute('for')) {
      await option.click();
    } else {
      await option.click();
    }
  }

  async continue(): Promise<void> {
    await this.page.locator(this.continueButton).first().click();
  }
}


