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
    // TODO (verify via codegen): password fields don't get an implicit
    // 'textbox' role, so this relies on a <label for="..."> association.
    // If the field only has a placeholder, swap for
    // page.getByPlaceholder(/password/i).
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

  // Confirmed via screenshot: a pink banner reading exactly "Invalid email
  // or password" — appears identically for empty fields AND wrong
  // credentials. Matching on the exact text is more robust here than
  // guessing at an ARIA role we can't confirm without DOM inspection.
  errorMessage(): Locator {
    return this.page.getByText('Invalid email or password');
  }
}
