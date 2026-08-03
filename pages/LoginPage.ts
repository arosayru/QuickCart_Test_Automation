import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    // TODO: Confirm with codegen. This locator relies on the password
    // field being associated with a <label>, since password inputs don't
    // have an implicit 'textbox' role. Use
    // page.getByPlaceholder(/password/i) if the field only has a placeholder.
    this.passwordInput = page.getByLabel(/password/i);
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });
    this.loginButton = page.getByRole('button', { name: /log in/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
  }

  async open() {
    await this.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async toggleRememberMe() {
    await this.rememberMeCheckbox.click();
  }

  // Based on the screenshot, the same pink "Invalid email or password"
  // banner is shown whether the fields are empty or the credentials are
  // incorrect. Since the DOM hasn't been inspected, matching the exact
  // text is safer than relying on an assumed ARIA role.
  errorMessage(): Locator {
    return this.page.getByText('Invalid email or password');
  }
}
