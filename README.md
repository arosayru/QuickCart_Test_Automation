# QuickCart — Playwright Test Automation

Automated test suite for [QuickCart](https://cart-quirks-shop.lovable.app/), built with Playwright, TypeScript, and the Page Object Model pattern, as part of a QA technical assessment.

## Tech Stack

- **Playwright** + **TypeScript**
- Page Object Model (POM) — locators and actions in `pages/`, all assertions in `tests/`
- `getByRole` / `getByText` / `getByLabel` used throughout in place of CSS selectors, per Playwright's recommended locator strategy

## Project Structure

```text
QuckCart/
├── playwright.config.ts       # baseURL, browser projects, tracing/screenshots
├── tsconfig.json
├── pages/                     # Page Objects — locators + actions only
│   ├── BasePage.ts            # shared nav, shared goto()
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   └── SignUpPage.ts
├── test-data/
│   └── mockData.ts            # fixtures shaped as MongoDB documents; dynamic user factory
└── tests/                     # *.spec.ts — all `expect` assertions live here
    ├── add-to-cart.spec.ts
    ├── cart-quantity-pricing.spec.ts
    ├── checkout-validation.spec.ts
    ├── login-validation.spec.ts
    └── performance.spec.ts
```

## Setup

```bash
npm install
npx playwright install
```

## Running the Tests

```bash
npm test          # headless, all configured browsers
npm run test:ui   # interactive UI mode
npm run report    # open the last HTML report
```

## Test Coverage

| Spec | Covers |
|---|---|
| `add-to-cart.spec.ts` | Adding a product to the cart; empty-cart state |
| `cart-quantity-pricing.spec.ts` | Quantity updates recalculating line/cart totals (incl. tax); item removal |
| `login-validation.spec.ts` | Empty-field vs. invalid-credential error handling; a full self-registering login flow |
| `checkout-validation.spec.ts` | **Known defect** — checkout accepts an order with no shipping address at all (see bug report). Uses `test.fail()` so this is tracked as an expected failure rather than a build-breaking one; if the site is ever fixed, this test will flip to failing "unexpectedly," which is the signal to update it. |
| `performance.spec.ts` | Page-load time budget on `/products`; add-to-cart interaction latency |

## Known Defects

Full defect list with steps to reproduce, expected/actual results, severity, and priority is tracked separately in the project's Google Sheets bug report (see submission email). The most significant findings — a checkout that confirms orders with blank shipping info, and a cart that accepts negative quantities producing a negative order total — are also captured as automated regression tests above.

## CI

A GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the full suite on every push and pull request to `main`.