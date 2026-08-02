import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { createDynamicTestUser } from '../test-data/mockData';

test.describe('Scenario 3: Login Form Validation', () => {
  test('shows the same generic error banner for empty credentials as for invalid ones', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.loginButton.click();

    // Confirmed behavior: the app does not distinguish "blank field" from
    // "wrong credentials" — both surface the identical banner text.
    await expect(loginPage.errorMessage()).toBeVisible();
    await expect(loginPage.errorMessage()).toHaveText('Invalid email or password');
  });

  test('shows an error message for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.login('not-a-real-user@example.com', 'WrongPassword123');

    await expect(loginPage.errorMessage()).toBeVisible();
  });

  test('logs in successfully with a freshly self-registered user', async ({ page }) => {
    const newUser = createDynamicTestUser();

    // This site has no seeded backend account to log into, so the test
    // creates its own — self-contained and safe to re-run.
    const signUpPage = new SignUpPage(page);
    await signUpPage.open();
    await signUpPage.signUp(newUser);

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(newUser.email, newUser.password);

    await expect(page).not.toHaveURL(/\/login$/);
  });
});
