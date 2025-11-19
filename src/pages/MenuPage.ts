import { type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  private readonly dishRoot = '[data-cy="dish"]';
  private readonly dishName = '.dish-name';
  private readonly addMealButton = 'button.cu-btn.cu-primary-light.bold.add-meal, button.add-meal-mobile';
  private readonly quantityInput = 'input.quantity';
  private readonly incrementButton = 'button.increment';
  private readonly cartArea = '[data-cy="cart"]';
  private readonly checkoutButton = '[data-cy="button-checkout"]';
  private readonly menuSelector = '[data-cy="menu"]';
  private readonly filterInputSelector =
    'label.input-with-icon.filter-name input.text.cu-input';

  async addMeal(mealName: string, targetCount = 25): Promise<void> {
    await expect(this.page.locator(this.menuSelector)).toBeVisible({ timeout: 80000 });
    await this.filterByMealName(mealName);
    const dish = this.page
      .locator(this.dishRoot)
      .filter({ has: this.page.locator(this.dishName, { hasText: mealName }) })
      .first();

    await expect(dish, `Dish "${mealName}" should be visible`).toBeVisible();

    const addBtn = dish.locator(this.addMealButton).first();
    if (await addBtn.isVisible()) {
      await addBtn.scrollIntoViewIfNeeded();
      await addBtn.click();
    }

    const qtyInput = dish.locator(this.quantityInput).first();
    await expect(qtyInput, 'Quantity input should appear after adding').toBeVisible();
    let increment = dish.locator(this.incrementButton).first();

    const current = Number.parseInt((await qtyInput.inputValue()) || '0', 10) || 0;
    const incrementsNeeded = Math.max(targetCount - current, 0);
    for (let i = 0; i < incrementsNeeded; i += 1) {
      increment = dish.locator(this.incrementButton).first();
      await increment.click();
    }
  }

  async filterByMealName(mealName: string): Promise<void> {
    const filterInput = this.page.locator(this.filterInputSelector).first();
    await filterInput.fill(mealName);
    await filterInput.press('Enter');
  }

  async clickOrderCheckoutButton(): Promise<void> {
    await this.page.locator(this.cartArea).first().hover();
    await this.page.locator(this.checkoutButton).first().click();
  }
}


