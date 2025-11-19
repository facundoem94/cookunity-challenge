import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeliverySchedulePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  private readonly datePickerSelector = '[data-cy="dtp"]';
  private readonly enabledDaySelector = '[data-cy="dtp-day"]:not(.disabled)';
  private readonly availableTimeSelector = '[data-cy="dtp-hour"]';
  private readonly continueButton = '[data-cy="button-continue"]';
  private readonly monthYearHeaderSelector = '.datetimepicker-days .switch';

  async selectFirstAvailableDate(): Promise<{ date: string; month: string; year: string; time: string }> {
    await this.page.locator(this.datePickerSelector).click();
    const header = this.page.locator(this.monthYearHeaderSelector).first();
    const headerText = (await header.textContent())?.trim() || '';
    const [month = '', year = ''] = headerText.split(/\s+/);
    const dateEl = this.page.locator(this.enabledDaySelector).first();
    await dateEl.scrollIntoViewIfNeeded();
    const dateText = (await dateEl.textContent())?.trim() || '';
    await dateEl.click();

    const timeEl = this.page.locator(this.availableTimeSelector).first();
    const timeText = (await timeEl.textContent())?.trim() || '';
    await timeEl.click();
    return { date: dateText, month, year, time: timeText };
  }

  async continue(): Promise<void> {
    await this.page.locator(this.continueButton).first().click();
  }
}


