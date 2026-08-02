import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { findProductByName } from '../test-data/mockData';

test.describe('Scenario 1: Add to Cart', () => {
  test('adding a product from the catalog reflects the correct item and price in the cart', async ({
    page,
  }) => {
    const productName = 'Wireless Headphones';
    const expected = findProductByName(productName);

    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await expect(productsPage.pageHeading).toBeVisible();

    await productsPage.addProductToCart(productName);

    const cartPage = new CartPage(page);
    await cartPage.open();

    await expect(cartPage.emptyCartMessage).not.toBeVisible();
    await expect(page.getByText(productName, { exact: true })).toBeVisible();
    await expect(cartPage.lineItemSubtotal(productName)).toHaveText(
      `$${expected.price.toFixed(2)}`
    );
  });

  test('cart stays empty until a product is added', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.open();

    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.shopNowLink).toBeVisible();
  });
});
