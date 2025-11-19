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

  async addMeal(mealName: string, targetCount = 25): Promise<void> {
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
    const increment = dish.locator(this.incrementButton).first();

    const current = Number.parseInt((await qtyInput.inputValue()) || '0', 10) || 0;
    const incrementsNeeded = Math.max(targetCount - current, 0);
    for (let i = 0; i < incrementsNeeded; i += 1) {
      await increment.click();
    }
  }
}


