import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GetAddressPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly continueButtonLabel = 'Continue';

  async continue(): Promise<void> {
    await this.clickByButtonOrLink(this.continueButtonLabel);
  }
}


