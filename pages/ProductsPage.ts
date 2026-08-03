import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly paginationStatus: Locator; // ex: "Page 1 of 3"

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Products', exact: true });
    this.paginationStatus = page.getByText(/Page \d+ of \d+/);
  }

  async open() {
    await this.goto('/products');
  }

  /**
   * Limits the locator to the product card itself. Matching only the
   * heading also matches its ancestor containers, so `.first()` selects
   * the outermost element and triggers a strict-mode violation by
   * containing every "Add to cart" button. Filtering by both the heading
   * and the button, then using `.last()`, correctly targets the card.
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
