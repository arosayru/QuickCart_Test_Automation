import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Scenario 4: Checkout Shipping Validation (known defect)', () => {
  // This test is intentionally expected to fail until the checkout bug is fixed.
  // Playwright won't mark the build as failed while the failure is expected,
  // but it will notify us if the test unexpectedly passes.
  // Tracking bug: "Checkout succeeds without a shipping address."
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
    // Deliberately skip fillShippingAddress() - this is the point of the test.
    await checkoutPage.placeOrderWithoutShippingDetails();

    // Expected: an empty shipping address should prevent checkout and show a
    // validation error on /checkout. Actual: the order is completed anyway.
    await expect(checkoutPage.orderConfirmedHeading).not.toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
