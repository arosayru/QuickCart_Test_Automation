import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly pageHeading: Locator;
  readonly fullNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryInput: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmedHeading: Locator;

  constructor(page: Page) {
    super(page);
    // Based on the screenshot rather than codegen. Unlike the sign-up form,
    // these labels don't display the "*" required marker, which is another
    // hint related to the bug below. If any locator fails, verify it with:
    // npx playwright codegen https://cart-quirks-shop.lovable.app/checkout
    this.pageHeading = page.getByRole('heading', { name: 'Checkout', exact: true });
    this.fullNameInput = page.getByRole('textbox', { name: 'Full name' });
    this.streetInput = page.getByRole('textbox', { name: 'Street' });
    this.cityInput = page.getByRole('textbox', { name: 'City' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.zipInput = page.getByRole('textbox', { name: 'ZIP' });
    this.countryInput = page.getByRole('textbox', { name: 'Country' });
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
    this.orderConfirmedHeading = page.getByRole('heading', { name: 'Order confirmed!' });
  }

  async open() {
    await this.goto('/checkout');
  }

  async placeOrderWithoutShippingDetails() {
    await this.placeOrderButton.click();
  }

  async fillShippingAddress(details: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) {
    await this.fullNameInput.fill(details.fullName);
    await this.streetInput.fill(details.street);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.zipInput.fill(details.zip);
    await this.countryInput.fill(details.country);
  }
}
