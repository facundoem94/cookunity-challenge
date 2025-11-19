import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GetAddressPage } from '../pages/GetAddressPage';
import { DeliveryTypePage } from '../pages/DeliveryTypePage';
import { DeliverySchedulePage } from '../pages/DeliverySchedulePage';
import { MenuPage } from '../pages/MenuPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { ThankYouPage } from '../pages/ThankYouPage';
import { BottomBar } from '../pages/components/BottomBar';
import { MyActionsPage } from '../pages/MyActionsPage';

type PageFixtures = {
  loginPage: LoginPage;
  getAddressPage: GetAddressPage;
  deliveryTypePage: DeliveryTypePage;
  deliverySchedulePage: DeliverySchedulePage;
  menuPage: MenuPage;
  checkoutPage: CheckoutPage;
  confirmationPage: ConfirmationPage;
  thankYouPage: ThankYouPage;
  bottomBar: BottomBar;
  myActionsPage: MyActionsPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  getAddressPage: async ({ page }, use) => {
    await use(new GetAddressPage(page));
  },
  deliveryTypePage: async ({ page }, use) => {
    await use(new DeliveryTypePage(page));
  },
  deliverySchedulePage: async ({ page }, use) => {
    await use(new DeliverySchedulePage(page));
  },
  menuPage: async ({ page }, use) => {
    await use(new MenuPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },
  thankYouPage: async ({ page }, use) => {
    await use(new ThankYouPage(page));
  },
  bottomBar: async ({ page }, use) => {
    await use(new BottomBar(page));
  },
  myActionsPage: async ({ page }, use) => {
    await use(new MyActionsPage(page));
  },
});

export { expect };


