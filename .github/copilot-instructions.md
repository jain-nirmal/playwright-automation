# Copilot Instructions for Udemy-Project

This is a **Playwright-based E-commerce test automation framework** for a Rahul Shetty Academy client application. Use these patterns when modifying or extending test code.

## Architecture Overview

**Key Components:**
- **Pom/** - Page Object Model classes (LoginPage, DashboardPage, CartPage, CheckoutPage, OrderHistory)
- **tests/** - Test specifications with two patterns: direct UI tests and parameterized tests
- **utils/** - Test data (JSON) and utility classes (selfHealingLocator for resilient selectors)
- **playwright.config.js** - Browser configuration (chromium headless:false, firefox headless:true, webkit iPhone 13 profile)

**Data Flow:** Tests → Page Objects → Playwright Page API → Target App

## Page Object Model Pattern

All page interactions are encapsulated in `Pom/` classes. Each page class:
1. Stores locators as instance properties in constructor: `this.userName = page.locator("#userEmail")`
2. Implements async methods for user actions: `async validLogin(email, password)`
3. Uses `page.waitForLoadState('networkidle')` for navigation waits
4. Exports as CommonJS: `module.exports = { LoginPage }`

**Example:** [Loginpage.js](Pom/Loginpage.js) - Constructor defines all locators; methods encapsulate workflows (goToURL, validLogin).

## Test Patterns

### 1. **Page Object-Based Tests** (Preferred)
Location: [clientAppPageObect.spec.js](tests/clientAppPageObect.spec.js)
- Instantiate all page objects at test start
- Call methods sequentially (loginPage → dashboardPage → cartPage → etc.)
- Use external JSON data from `utils/placeOrderTestData.json`

### 2. **Parameterized Tests with Loops**
Location: [clientAppDataParametrization.spec.js](tests/clientAppDataParametrization.spec.js)
- Wrap test in `for (const dataSet of dataSetParameter)` loop
- Load JSON with: `JSON.parse(JSON.stringify(require('../utils/DataParameterTestData.json')))`
- Dynamically name tests: `@Webst Client App login for ${dataSet.productName}`
- Runs same test multiple times with different credentials/products

## Critical Conventions

1. **Locators use CSS selectors, text, and aria roles:**
   - Simple ID: `#userEmail`
   - Text matching: `text=Add To Cart`, `h3:has-text('ZARA COAT 3')`
   - Attribute wildcards: `[routerlink*='cart']`, `[placeholder*='Country']`

2. **Always wait for elements before assertions:**
   - `await this.product.waitFor()` before visibility checks
   - `await this.dropdown.waitFor()` before counting/clicking options
   - Use `.first().waitFor()` for dynamic lists: `await this.productsText.first().waitFor()`

3. **Dropdowns handled manually** (not select elements):
   - Send partial text: `await this.countryInput.pressSequentially("ind")`
   - Count options and loop through buttons to find exact match
   - [CheckoutPage.js](Pom/CheckoutPage.js#L17-L26) shows India selection pattern

4. **Order ID extraction and verification:**
   - Extract after order confirmation: `const orderId = await this.orderId.textContent()`
   - Search in order history table using loop over rows
   - Include in assertions: `expect(orderId.includes(orderIdDetails)).toBeTruthy()`

## Test Execution Commands

From [package.json](package.json):
```bash
npm run regression          # Run all tests
npm run Nirmal             # Run tests tagged with @Nirmal
```

Use Playwright's `--grep` for tag-based filtering: `npx playwright test --grep @Webst`

## Browser Configurations

From [playwright.config.js](playwright.config.js):
- **Chromium:** headless:false, screenshots:on, trace:on, ignoreHTTPSErrors, 1 worker
- **Firefox:** headless:true, screenshots:on, trace:on
- **WebKit:** iPhone 13 profile, headless:false, trace:off

Retries: 1 | Timeout: 30s | Expect timeout: 5s

## Self-Healing Locators (Advanced)

[selfHealingLocator.js](utils/selfHealingLocator.js) provides fallback selector support:
- Constructor takes array of {key, selectors} objects
- `getLocator(key)` tries selectors in order, returns first match
- `updateLocator(key, newSelector)` adds new selector to fallback list
- Currently unused but available for fragile test maintenance

## Common File Patterns

- **Test files:** `*.spec.js` with exports from Pom classes
- **Test data:** JSON files in `utils/` referenced via require()
- **POM classes:** Single responsibility per page, constructor-based locator storage
- **Exports:** `module.exports = { ClassName }` for all classes

## Red Flags / Avoid

- Don't use raw locators in tests—always create POM methods
- Don't hardcode credentials—use JSON data from utils/
- Missing waits before assertions cause flaky tests
- Don't skip `.waitFor()` or `waitForLoadState()` calls for async operations
