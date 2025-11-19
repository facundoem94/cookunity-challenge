import { test, expect } from '../../../src/fixtures/baseTest';

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

test('Frontend — Place order to Thank You with dynamic delivery slot selection', async ({
  page,
  myActionsPage,
  getAddressPage,
  deliveryTypePage,
  deliverySchedulePage,
  menuPage,
  checkoutPage,
  confirmationPage,
  thankYouPage,
  bottomBar,
}) => {
  await page.goto('/login');

  // 2. Click on “Place a new order.”
  await myActionsPage.clickPlaceNewOrder();

  expect(page.url()).toContain('/getAddress');

  // 3. Once you are on the /getAddress page, click on Continue.
  await getAddressPage.continue();

  // 4. Select “Delivery to a home” and click on Continue.
  await deliveryTypePage.chooseHomeDelivery();
  await deliveryTypePage.continue();

  // 5. Select a delivery date and a delivery window, then click on Continue
  await deliverySchedulePage.selectFirstAvailableDate();
  await deliverySchedulePage.continue();

  // 6. Add 25 of a specific meal
  await menuPage.addMeal("Adobo Chicken Burrito Bowl", 25);

  // 7. Reveal bottom bar and Order Checkout
  await bottomBar.revealAndCheckout();

  // 8. Checkout -> Company Invoice
  await checkoutPage.selectCompanyInvoice();

  // 9. Confirmation -> Order Checkout
  await confirmationPage.placeOrder();

  // 10-11. Thank You -> Assertions
  await thankYouPage.assertAddress('630 Flushing Avenue, 11206');
  await thankYouPage.assertEmail('testqachallenge@cookunity.com');
  await thankYouPage.assertPhone('+14412424244');

  const finalDate = normalize(await thankYouPage.getDeliveryDateText());
  expect(finalDate.length).toBeGreaterThan(0);
});


