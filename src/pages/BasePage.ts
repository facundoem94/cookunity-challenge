import { expect, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async clickByButtonOrLink(name: string): Promise<void> {
    const button = this.page.getByRole('button', { name, exact: true }).first();
    await expect(button).toBeVisible();
    if (await button.count()) {
      await button.click();
      return;
    }
    const link = this.page.getByRole('link', { name, exact: true }).first();
    await link.click();
  }
}


