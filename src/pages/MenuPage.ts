import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly addButton = 'button:has-text("Add")';
  private readonly cartCountBadge = '[data-testid="cart-count"], [aria-label*="items"], [class*="cart"] [class*="count"]';

  async addMeals(targetCount: number): Promise<void> {
    let added = await this.readCartCount();
    while (added < targetCount) {
      const adders = this.page.locator(this.addButton);
      const count = await adders.count();
      for (let i = 0; i < count && added < targetCount; i += 1) {
        await adders.nth(i).scrollIntoViewIfNeeded();
        await adders.nth(i).click();
        added = await this.readCartCount();
      }
      if (added < targetCount) {
        await this.page.mouse.wheel(0, 2000);
        await this.page.waitForLoadState('networkidle');
      }
    }
    await expect(await this.readCartCount()).toBeGreaterThanOrEqual(targetCount);
  }

  private async readCartCount(): Promise<number> {
    const badge = this.page.locator(this.cartCountBadge).first();
    if (!(await badge.count())) return 0;
    const text = (await badge.textContent())?.replace(/\D+/g, '') || '0';
    return Number.parseInt(text || '0', 10) || 0;
  }
}


