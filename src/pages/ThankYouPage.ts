import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ThankYouPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly emailPhoneRow = 'p:has(img[src*=\"icon-user-circle\"]) .txt-norm-2';
  private readonly dateRow = 'p:has(img[src*=\"icon-calendar-grey\"]) .txt-norm-2';
  private readonly addressRow = 'p:has(img[src*=\"icon-location\"]) .txt-norm-2';

  async assertAddress(expected: string): Promise<void> {
    const text = await this.readText(this.addressRow);
    await expect(text).toContain(expected);
  }

  async assertEmail(expected: string): Promise<void> {
    const text = await this.readText(this.emailPhoneRow);
    await expect(text).toContain(expected);
  }

  async assertPhone(expected: string): Promise<void> {
    const text = await this.readText(this.emailPhoneRow);
    await expect(text).toContain(expected);
  }

  async getDeliveryDateText(): Promise<string> {
    return this.readText(this.dateRow);
  }

  private async readText(selector: string): Promise<string> {
    const loc = this.page.locator(selector).first();
    await loc.scrollIntoViewIfNeeded();
    return (await loc.textContent())?.trim() || '';
  }
}


