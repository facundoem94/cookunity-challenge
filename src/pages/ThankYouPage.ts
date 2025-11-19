import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ThankYouPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly addressValue = '[data-testid="delivery-address"], text=Delivery sent to';
  private readonly emailValue = '[data-testid="contact-email"]';
  private readonly phoneValue = '[data-testid="contact-phone"]';
  private readonly dateValue = '[data-testid="delivery-date"], text=Delivery date';

  async assertAddress(expected: string): Promise<void> {
    const text = await this.readText(this.addressValue);
    await expect(text).toContain(expected);
  }

  async assertEmail(expected: string): Promise<void> {
    const text = await this.readText(this.emailValue);
    await expect(text).toContain(expected);
  }

  async assertPhone(expected: string): Promise<void> {
    const text = await this.readText(this.phoneValue);
    await expect(text).toContain(expected);
  }

  async getDeliveryDateText(): Promise<string> {
    return this.readText(this.dateValue);
  }

  private async readText(selector: string): Promise<string> {
    const loc = this.page.locator(selector).first();
    await loc.scrollIntoViewIfNeeded();
    return (await loc.textContent())?.trim() || '';
  }
}


