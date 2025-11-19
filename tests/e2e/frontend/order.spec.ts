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
  const { date, month, year, time } = await deliverySchedulePage.selectFirstAvailableDate();
  await deliverySchedulePage.continue();

  // 6. Add 25 of a specific meal
  await menuPage.addMeal("Adobo Chicken and Chorizo Paella", 25);

  // 7 Click on the “Order Checkout” button (hidden by mouse over on the bottom bar).
  await menuPage.clickOrderCheckoutButton();

  // 8. On the Checkout page, click on “Company Invoice.”
  await checkoutPage.clickCompanyInvoiceButton();

  // 9. On the Confirmation page, click on Order Checkout.
  await confirmationPage.orderCheckout();
  
  await expect(page.getByText('Delivery information')).toBeVisible({timeout: 30000});

  // 10. On the “Thank You” page, ensure details are correct.
  await thankYouPage.assertAddress('630 Flushing Avenue, 11206');
  await thankYouPage.assertEmail('testqachallenge@cookunity.com');
  await thankYouPage.assertPhone('+14412424244');

  const finalDate = normalize(await thankYouPage.getDeliveryDateText());
  const expectedDelivery = normalize(`${month} ${date}, ${year} ${time}`);
  expect(finalDate).toContain(expectedDelivery);
});


