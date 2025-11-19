import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeliveryTypePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly continueButtonLabel = 'Continue';

  async chooseHomeDelivery(): Promise<void> {
    await this.page.locator('label').filter({ hasText: 'Delivered to a home' }).click();
  }

  async continue(): Promise<void> {
    await this.clickByButtonOrLink(this.continueButtonLabel);
  }
}


