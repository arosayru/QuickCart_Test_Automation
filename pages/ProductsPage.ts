import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly paginationStatus: Locator; // e.g. "Page 1 of 3"

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Products', exact: true });
    this.paginationStatus = page.getByText(/Page \d+ of \d+/);
  }

  async open() {
    await this.goto('/products');
  }

  /**
   * Scopes to the specific product card. A single `.filter({has: heading})`
   * matches every ancestor div containing that heading (the card, the grid
   * container, the page wrapper...) — `.first()` grabbed the outermost one,
   * causing a strict-mode violation across all 5 "Add to cart" buttons.
   * Adding a second filter (has: the button) and taking `.last()` instead
   * resolves to the innermost div containing both — the actual card.
   */
  private productCard(productName: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByRole('heading', { name: productName, exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Add to cart' }) })
      .last();
  }

  productPrice(productName: string): Locator {
    return this.productCard(productName).getByText(/^\$\d+(\.\d{1,2})?$/);
  }

  productCategoryTag(productName: string): Locator {
    return this.productCard(productName).getByText(/^(Audio|Wearable|Office)$/);
  }

  addToCartButton(productName: string): Locator {
    return this.productCard(productName).getByRole('button', { name: 'Add to cart' });
  }

  async addProductToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  paginationButton(pageNumber: number): Locator {
    return this.page.getByRole('button', { name: String(pageNumber), exact: true });
  }

  async goToPage(pageNumber: number) {
    await this.paginationButton(pageNumber).click();
  }
}
