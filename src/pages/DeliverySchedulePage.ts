import { Page } from '@playwright/test';
import { type OrderState } from '../fixtures/baseTest';
import { BasePage } from './BasePage';

export class DeliverySchedulePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly enabledDateSelector =
    '[aria-disabled="false"], [role="button"]:not([aria-disabled="true"]):not([disabled])';
  private readonly windowListSelector =
    '[data-testid="delivery-window"], [role="listitem"], button:has-text("AM"), button:has-text("PM")';

  async selectFirstAvailableDateAndWindow(orderState: OrderState): Promise<void> {
    const firstDate = this.page.locator(this.enabledDateSelector).first();
    await firstDate.scrollIntoViewIfNeeded();
    const dateText = (await firstDate.textContent())?.trim() || '';
    await firstDate.click();

    const firstWindow = this.page.locator(this.enabledDateSelector).locator(this.windowListSelector).first();
    if (await firstWindow.count()) {
      await firstWindow.scrollIntoViewIfNeeded();
      const windowText = (await firstWindow.textContent())?.trim() || '';
      await firstWindow.click();
      orderState.selectedDateText = dateText;
      orderState.selectedWindowText = windowText;
      return;
    }

    const anyWindow = this.page.locator(this.windowListSelector).first();
    await anyWindow.scrollIntoViewIfNeeded();
    const winText = (await anyWindow.textContent())?.trim() || '';
    await anyWindow.click();
    orderState.selectedDateText = dateText;
    orderState.selectedWindowText = winText;
  }
}


