import { test, expect } from '../../../src/fixtures/baseTest';

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

test('Frontend — Place order to Thank You with dynamic delivery slot selection', async ({
  page,
  getAddressPage,
  deliveryTypePage,
  deliverySchedulePage,
  menuPage,
  checkoutPage,
  confirmationPage,
  thankYouPage,
  bottomBar,
  orderState,
}) => {
  await page.goto('/login');

  // 2. Place a new order (button or link)
  const placeOrderBtn = page.getByRole('button', { name: /place a new order/i }).first();
  if (await placeOrderBtn.count()) {
    await placeOrderBtn.click();
  } else {
    const placeOrderLink = page.getByRole('link', { name: /place a new order/i }).first();
    if (await placeOrderLink.count()) {
      await placeOrderLink.click();
    }
  }

  // 3. /getAddress -> Continue
  await getAddressPage.continue();

  // 4. Delivery type -> Home + Continue
  await deliveryTypePage.chooseHomeDelivery();
  await deliveryTypePage.continue();

  // 5. Schedule -> first enabled date/window (store in orderState)
  await deliverySchedulePage.selectFirstAvailableDateAndWindow(orderState);

  // 6. Add 25 meals
  await menuPage.addMeals(25);

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
  const selected = normalize(`${orderState.selectedDateText || ''} ${orderState.selectedWindowText || ''}`);
  expect(finalDate).toContain(orderState.selectedDateText || '');
  if (orderState.selectedWindowText) {
    expect(finalDate).toContain(orderState.selectedWindowText);
  }
});


