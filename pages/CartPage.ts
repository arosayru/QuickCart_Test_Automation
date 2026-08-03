import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly emptyCartMessage: Locator;
  readonly shopNowLink: Locator;
  readonly checkoutLink: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.shopNowLink = page.getByRole('link', { name: 'Shop now' });
    // Confirmed via earlier page snapshot: "Proceed to checkout" is a link
    // (navigates to /checkout), not a button.
    this.checkoutLink = page.getByRole('link', { name: 'Proceed to checkout' });
    // Confirmed via test run: "Total" and its $ amount are separate sibling
    // elements (not one text node), so matching the label alone isn't
    // enough — scope to the row/container that holds both.
    this.cartTotal = page
      .locator('div')
      .filter({ has: page.getByText('Total', { exact: true }) })
      .last();
  }

  async open() {
    await this.goto('/cart');
  }

  // Confirmed via page snapshot: unlike the Products page (heading, level 3),
  // the product name on the Cart page renders as plain paragraph text.
  private cartLineItem(productName: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Remove' }) })
      .last();
  }

  lineItemQuantityInput(productName: string): Locator {
    return this.cartLineItem(productName).getByRole('spinbutton');
  }

  lineItemSubtotal(productName: string): Locator {
    return this.cartLineItem(productName).getByText(/^\$\d+(\.\d{1,2})?$/).last();
  }

  removeButton(productName: string): Locator {
    return this.cartLineItem(productName).getByRole('button', { name: /remove/i });
  }

  async setQuantity(productName: string, quantity: number) {
    const input = this.lineItemQuantityInput(productName);
    await input.fill(String(quantity));
    await input.blur();
  }

  async removeItem(productName: string) {
    await this.removeButton(productName).click();
  }
}
