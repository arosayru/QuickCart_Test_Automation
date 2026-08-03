import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Scenario 4: Checkout Shipping Validation (known defect)', () => {
  // Marks this test as expected to fail against the live site today.
  // Playwright reports it as an "expected failure" (not a red build) as
  // long as it keeps failing — and flags it loudly if it ever starts
  // passing, which is exactly the signal you want once this bug is fixed.
  // See bug report: "Checkout succeeds without a shipping address."
  test.fail(
    true,
    'Known defect — checkout confirms an order with no shipping address at all. Tracked in the bug report.'
  );

  test('placing an order without a shipping address should be blocked', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.addProductToCart('Bluetooth Speaker');

    const cartPage = new CartPage(page);
    await cartPage.open();

    await cartPage.checkoutLink.click();

    const checkoutPage = new CheckoutPage(page);
    // Deliberately skip fillShippingAddress() — this is the point of the test.
    await checkoutPage.placeOrderWithoutShippingDetails();

    // Expected (once fixed): the order is rejected and the user stays on
    // /checkout with a validation message. Actual: the site confirms the
    // order anyway with an empty shipping address.
    await expect(checkoutPage.orderConfirmedHeading).not.toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
