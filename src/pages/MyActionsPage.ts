import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyActionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly manageOrdersLabel = 'Manage my orders';
  private readonly placeNewOrderLabel = 'Place a new order';
  private readonly dietaryProfilesLabel = 'Dietary Profiles';
  private readonly signOutLabel = 'Sign out';

  async clickManageMyOrders(): Promise<void> {
    await this.clickByButtonOrLink(this.manageOrdersLabel);
  }

  async clickPlaceNewOrder(): Promise<void> {
    await this.clickByButtonOrLink(this.placeNewOrderLabel);
  }

  async clickDietaryProfiles(): Promise<void> {
    await this.clickByButtonOrLink(this.dietaryProfilesLabel);
  }

  async clickSignOut(): Promise<void> {
    await this.clickByButtonOrLink(this.signOutLabel);
  }

}


