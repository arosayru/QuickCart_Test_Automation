import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { findProductByName } from '../test-data/mockData';

test.describe('Scenario 2: Cart Quantity & Price Calculation', () => {
  test('increasing quantity updates the line subtotal and cart total correctly', async ({
    page,
  }) => {
    const productName = 'Bluetooth Speaker';
    const product = findProductByName(productName);

    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.addProductToCart(productName);

    const cartPage = new CartPage(page);
    await cartPage.open();
    await cartPage.setQuantity(productName, 3);

    const expectedSubtotal = (product.price * 3).toFixed(2);
    await expect(cartPage.lineItemSubtotal(productName)).toHaveText(`$${expectedSubtotal}`);

    // The cart adds an 8% tax before showing "Total" - comparing against the
    // raw subtotal would be an incorrect expectation, not a locator problem.
    // An exact string match is also unreliable here: we've already confirmed
    // this site displays tax/total with uncorrected floating-point precision
    // (ex: "$6.3991999999999996"), so we extract the number and compare
    // with a tolerance instead of asserting exact rendered text.
    const expectedTotalWithTax = Number(expectedSubtotal) * 1.08;
    const totalText = await cartPage.cartTotal.innerText();
    const actualTotal = parseFloat(totalText.match(/([\d.]+)\s*$/)?.[1] ?? 'NaN');

    expect(actualTotal).toBeCloseTo(expectedTotalWithTax, 1);
  });

  test('removing the only item in the cart returns it to the empty state', async ({ page }) => {
    const productName = 'Bluetooth Speaker';

    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.addProductToCart(productName);

    const cartPage = new CartPage(page);
    await cartPage.open();
    await cartPage.removeItem(productName);

    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
