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
    // An earlier page snapshot confirmed that "Proceed to checkout"
    // is a link rather than a button, since it navigates to /checkout.
    this.checkoutLink = page.getByRole('link', { name: 'Proceed to checkout' });
    // Verified during testing: the "Total" label and its dollar amount
    // are rendered as separate sibling elements, not a single text node.
    // Match the row or container that includes both instead of the label alone.
    this.cartTotal = page
      .locator('div')
      .filter({ has: page.getByText('Total', { exact: true }) })
      .last();
  }

  async open() {
    await this.goto('/cart');
  }

  // An earlier page snapshot showed that the Cart page displays the
  // product name as regular paragraph text, unlike the Products page,
  // where it's rendered as a level 3 heading.
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
