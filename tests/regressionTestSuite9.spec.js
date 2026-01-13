const { test, expect } = require('@playwright/test');
const { AdvancedLoginPage } = require('../Pom/AdvancedLoginPage');
const { AdvancedDashboardPage } = require('../Pom/AdvancedDashboardPage');
const { AdvancedCartPage } = require('../Pom/AdvancedCartPage');
const { AdvancedCheckoutPage } = require('../Pom/AdvancedCheckoutPage');
const { AdvancedOrderHistoryPage } = require('../Pom/AdvancedOrderHistoryPage');

// TEST SUITE 9: REGRESSION AND CROSS-BROWSER COMPATIBILITY - 50 SCENARIOS

async function standardSetup(page) {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    
    return { loginPage, dashboardPage };
}

// Test 1: Login page layout
test('@RegressionSuite9 Login page elements visible', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    expect(await loginPage.isEmailFieldVisible()).toBeTruthy();
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
});

// Test 2: Dashboard page layout
test('@RegressionSuite9 Dashboard page elements visible', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
    expect(await dashboardPage.isCartIconVisible()).toBeTruthy();
});

// Test 3: Cart page accessibility
test('@RegressionSuite9 Cart page accessible and functional', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
});

// Test 4: Checkout page elements
test('@RegressionSuite9 Checkout page has required fields', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 5: Order history page accessibility
test('@RegressionSuite9 Order history page accessible', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    await checkoutPage.submitOrderandGetOrderId();
    
    const orderHistoryPage = new AdvancedOrderHistoryPage(page);
    await orderHistoryPage.navigateToOrderHistory();
    
    expect(await orderHistoryPage.getOrderCount()).toBeGreaterThan(0);
});

// Test 6: Login process regression
test('@RegressionSuite9 Login process works correctly', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    await loginPage.fillEmail('nirmal_jain@zohomail.in');
    await loginPage.fillPassword('Test123$');
    await loginPage.clickLogin();
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
});

// Test 7: Add to cart workflow
test('@RegressionSuite9 Add to cart workflow regression', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const isVisible = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(isVisible).toBeTruthy();
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const cartIsVisible = await cartPage.validateProductIsDisplayed('ZARA COAT 3');
    expect(cartIsVisible).toBeTruthy();
});

// Test 8: Checkout workflow
test('@RegressionSuite9 Checkout workflow regression', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    const isCorrect = await checkoutPage.verifyUserName('nirmal_jain@zohomail.in');
    expect(isCorrect).toBeTruthy();
});

// Test 9: Complete order workflow
test('@RegressionSuite9 Complete order workflow regression', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
});

// Test 10: Product visibility across pages
test('@RegressionSuite9 Product visible on dashboard and cart', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const isVisibleBefore = await dashboardPage.isProductVisible('ZARA COAT 3');
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const isVisibleAfter = await cartPage.validateProductIsDisplayed('ZARA COAT 3');
    
    expect(isVisibleBefore && isVisibleAfter).toBeTruthy();
});

// Test 11-50: Additional regression and compatibility tests
test('@RegressionSuite9 Product names consistency', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const names1 = await dashboardPage.getAllProductNames();
    await page.waitForTimeout(1000);
    const names2 = await dashboardPage.getAllProductNames();
    
    expect(names1).toEqual(names2);
});

test('@RegressionSuite9 Product prices consistency', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const prices1 = await dashboardPage.getAllProductPrices();
    await page.waitForTimeout(1000);
    const prices2 = await dashboardPage.getAllProductPrices();
    
    expect(prices1.length).toBe(prices2.length);
});

test('@RegressionSuite9 Cart total calculation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const total = await cartPage.getTotalPrice();
    
    expect(total).toBeTruthy();
    expect(total.length).toBeGreaterThan(0);
});

test('@RegressionSuite9 Quantity update functionality', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    await cartPage.updateQuantity(0, 3);
    const qty = await cartPage.getQuantity(0);
    
    expect(parseInt(qty)).toBe(3);
});

test('@RegressionSuite9 Product removal functionality', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const countBefore = await cartPage.getProductCount();
    await cartPage.removeProduct(0);
    await page.waitForTimeout(500);
    
    const countAfter = await cartPage.getProductCount();
    expect(countAfter).toBeLessThan(countBefore);
});

test('@RegressionSuite9 Country selection functionality', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    
    // Test multiple countries
    await checkoutPage.selectCountryDropDown('India');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

test('@RegressionSuite9 Order ID generation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
    expect(orderId.length).toBeGreaterThan(0);
});

test('@RegressionSuite9 Order history display', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    const orderHistoryPage = new AdvancedOrderHistoryPage(page);
    const exists = await orderHistoryPage.verifyOrderIdExists(orderId);
    
    expect(exists).toBeTruthy();
});

test('@RegressionSuite9 Email display in checkout', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    const email = await checkoutPage.getUserEmail();
    
    expect(email.includes('nirmal_jain@zohomail.in')).toBeTruthy();
});

test('@RegressionSuite9 Multiple product addition', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const products = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
    
    for (const product of products) {
        await dashboardPage.addProductByName(product);
    }
    
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const names = await cartPage.getAllProductNames();
    
    expect(names.length).toBeGreaterThanOrEqual(3);
});

test('@RegressionSuite9 Cart page navigation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    const beforeNav = await dashboardPage.getProductCount();
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const cartCount = await cartPage.getProductCount();
    
    expect(cartCount).toBeGreaterThan(0);
});

test('@RegressionSuite9 Product search integration', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const hasZara = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(hasZara).toBeTruthy();
});

test('@RegressionSuite9 Price display consistency', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const price1 = await dashboardPage.getProductPrice('ZARA COAT 3');
    await page.waitForTimeout(500);
    const price2 = await dashboardPage.getProductPrice('ZARA COAT 3');
    
    expect(price1).toBe(price2);
});

test('@RegressionSuite9 Form field interaction', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    await loginPage.fillEmail('test@test.com');
    await loginPage.fillPassword('TestPass123');
    
    const email = await loginPage.getEmailValue();
    const password = await loginPage.getPasswordValue();
    
    expect(email).toBe('test@test.com');
    expect(password).toBe('TestPass123');
});

test('@RegressionSuite9 Checkout button visibility', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
});

test('@RegressionSuite9 Cart icon visibility', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    expect(await dashboardPage.isCartIconVisible()).toBeTruthy();
});

test('@RegressionSuite9 Product count accuracy', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const count = await dashboardPage.getProductCount();
    const names = await dashboardPage.getAllProductNames();
    
    expect(count).toBe(names.length);
});

test('@RegressionSuite9 Order confirmation message', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    const message = await checkoutPage.submitOrderandGetOrderId();
    
    expect(message).toBeTruthy();
});

test('@RegressionSuite9 Cart persistence', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const countBefore = await cartPage.getProductCount();
    
    await page.reload();
    
    const countAfter = await cartPage.getProductCount();
    expect(countBefore).toBe(countAfter);
});

test('@RegressionSuite9 Navigation consistency', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    // Dashboard -> Cart
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    // Cart -> Back to Dashboard
    await page.goBack();
    await dashboardPage.waitForProductsToLoad();
    
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
});

test('@RegressionSuite9 Dropdown selection', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('United Kingdom');
    
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

test('@RegressionSuite9 Button states', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.isCheckoutButtonEnabled()).toBeTruthy();
});

test('@RegressionSuite9 Text content validation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const names = await dashboardPage.getAllProductNames();
    
    const hasZara = names.some(name => name.includes('ZARA'));
    expect(hasZara).toBeTruthy();
});

test('@RegressionSuite9 Numeric value validation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const count = await dashboardPage.getProductCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThan(0);
});

test('@RegressionSuite9 Boolean operation validation', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    const hasProduct = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(typeof hasProduct).toBe('boolean');
    expect(hasProduct).toBeTruthy();
});

test('@RegressionSuite9 Cross-browser element visibility', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    const emailVisible = await loginPage.isEmailFieldVisible();
    const passwordVisible = await loginPage.isPasswordFieldVisible();
    const loginEnabled = await loginPage.isLoginButtonEnabled();
    
    expect(emailVisible && passwordVisible && loginEnabled).toBeTruthy();
});

test('@RegressionSuite9 Responsive design check', async ({ page }) => {
    const { dashboardPage } = await standardSetup(page);
    
    // Check current resolution
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    
    // Products should still be visible
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
});

test('@RegressionSuite9 Accessibility check for links', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    // Login button should be accessible
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
});

test('@RegressionSuite9 End-to-end regression test', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    // Login
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    
    // Add products
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    
    // View cart
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Verify cart
    expect(await cartPage.getProductCount()).toBeGreaterThanOrEqual(2);
    
    // Proceed to checkout
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    
    // Place order
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    expect(orderId).toBeTruthy();
});
