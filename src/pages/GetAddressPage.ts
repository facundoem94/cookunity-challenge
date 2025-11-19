import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GetAddressPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly continueButton = '[data-cy="button-continue"]';

  async continue(): Promise<void> {
    await this.page.locator(this.continueButton).first().click();
  }
}


