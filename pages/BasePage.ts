import { Page } from '@playwright/test';

/**
 * Common base for all page objects. The global navigation doesn't
 * change between Home, Products, Cart, Login, and Sign Up, so
 * we keep it here instead of repeating it in every page class.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  get nav() {
    return {
      productsLink: this.page.getByRole('link', { name: 'Products', exact: true }),
      // Codegen confirmed that the cart link updates its accessible name
      // to include the item count (e.g. "Cart 1"). Because of that, matching
      // exactly "Cart" isn't reliable, so a starts-with regex is used instead.
      cartLink: this.page.getByRole('link', { name: /^Cart/ }),
      loginLink: this.page.getByRole('link', { name: 'Login', exact: true }),
      signUpLink: this.page.getByRole('link', { name: 'Sign Up', exact: true }),
    };
  }

  async goToProducts() {
    await this.nav.productsLink.click();
  }

  async goToCart() {
    await this.nav.cartLink.click();
  }
}
