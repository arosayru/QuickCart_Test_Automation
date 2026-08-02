import { Page } from '@playwright/test';

/**
 * Shared shell for every page object: the global nav is identical
 * across Home / Products / Cart / Login / Sign Up, so it lives here
 * once instead of being redeclared in every subclass.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  get nav() {
    return {
      productsLink: this.page.getByRole('link', { name: 'Products', exact: true }),
      // NOTE: confirmed via codegen — once an item is in the cart, the link's
      // accessible name becomes "Cart 1", "Cart 2", etc. (a count badge is
      // appended). exact:'Cart' would silently stop matching, so this uses a
      // starts-with regex instead.
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
