import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.getByRole('textbox', { name: 'Full name *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone number *' });
    // exact: true is required here — without it, 'Password *' fuzzy-matches
    // as a substring of 'Confirm password *' too (confirmed via codegen).
    this.passwordInput = page.getByRole('textbox', { name: 'Password *', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password *' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async open() {
    await this.goto('/signup');
  }

  async signUp(details: { fullName: string; email: string; phone: string; password: string }) {
    await this.fullNameInput.fill(details.fullName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.password);
    await this.signUpButton.click();
  }
}
