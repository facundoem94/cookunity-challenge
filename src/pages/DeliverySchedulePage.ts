import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeliverySchedulePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly enabledDaySelector = '[data-cy="dtp-day"]:not(.disabled)';
  private readonly availableTimeSelector = '[data-cy="dtp-hour"]';
  private readonly continueButtonLabel = 'Continue';

  async selectFirstAvailableDate(): Promise<void> {
    await this.page.locator(this.enabledDaySelector).first().click();
    await this.page.locator(this.availableTimeSelector).first().click();
  }

  async continue(): Promise<void> {
    await this.clickByButtonOrLink(this.continueButtonLabel);
  }
}


