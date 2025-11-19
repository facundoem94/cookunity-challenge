import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly companyInvoiceButton = 'button:has-text("Company Invoice")';

  async selectCompanyInvoice(): Promise<void> {
    await this.page.locator(this.companyInvoiceButton).first().click();
  }
}


