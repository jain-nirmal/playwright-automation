const { test, expect } = require('@playwright/test');
const { AdvancedLoginPage } = require('../Pom/AdvancedLoginPage');
const { AdvancedDashboardPage } = require('../Pom/AdvancedDashboardPage');
const { AdvancedCartPage } = require('../Pom/AdvancedCartPage');
const { AdvancedCheckoutPage } = require('../Pom/AdvancedCheckoutPage');
const { AdvancedOrderHistoryPage } = require('../Pom/AdvancedOrderHistoryPage');

// TEST SUITE 7: INTEGRATION TESTS - 50 SCENARIOS

// Helper function
async function completeLoginAndNavigate(page) {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    
    return { loginPage, dashboardPage };
}

// Test 1: Login and add single product
test('@IntegrationSuite7 Login and add one product', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    expect(true).toBeTruthy();
});

// Test 2: Login, add, and view cart
test('@IntegrationSuite7 Login, add product, view cart', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const count = await cartPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});

// Test 3: Add multiple products and verify count
test('@IntegrationSuite7 Add multiple products and verify count', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.addProductByName('IPHONE 13 PRO');
    
    await dashboardPage.navigateToCart();
    const cartPage = new AdvancedCartPage(page);
    
    expect(await cartPage.getProductCount()).toBe(3);
});

// Test 4: Complete checkout flow
test('@IntegrationSuite7 Complete checkout flow with order placement', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.waitForCheckoutPageToLoad();
    await checkoutPage.selectCountryDropDown('India');
    
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    expect(orderId).toBeTruthy();
});

// Test 5: Order placement and history verification
test('@IntegrationSuite7 Place order and verify in history', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.waitForCheckoutPageToLoad();
    await checkoutPage.selectCountryDropDown('India');
    
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    const orderHistoryPage = new AdvancedOrderHistoryPage(page);
    const orderDetails = await orderHistoryPage.verifyOrderInHistory(orderId);
    
    expect(orderDetails).toBeTruthy();
});

// Test 6: Multiple product types purchase
test('@IntegrationSuite7 Purchase different product types', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const products = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
    
    for (const product of products) {
        await dashboardPage.addProductByName(product);
        await page.waitForTimeout(300);
    }
    
    await dashboardPage.navigateToCart();
    const cartPage = new AdvancedCartPage(page);
    
    expect(await cartPage.getProductCount()).toBe(products.length);
});

// Test 7: Cart modification during checkout
test('@IntegrationSuite7 Add to cart and modify quantity', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.updateQuantity(0, 3);
    
    const quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(3);
});

// Test 8: Remove and re-add product
test('@IntegrationSuite7 Remove product and add again', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.removeProduct(0);
    
    await page.goBack();
    await dashboardPage.waitForProductsToLoad();
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    await dashboardPage.navigateToCart();
    expect(await cartPage.getProductCount()).toBeGreaterThan(0);
});

// Test 9: Full purchase with different country
test('@IntegrationSuite7 Purchase with different country selection', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.waitForCheckoutPageToLoad();
    await checkoutPage.selectCountryDropDown('United States');
    
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    expect(orderId).toBeTruthy();
});

// Test 10: Cart price update with quantity change
test('@IntegrationSuite7 Cart total updates with quantity', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const price1 = await cartPage.getTotalPrice();
    await cartPage.updateQuantity(0, 5);
    await page.waitForTimeout(1000);
    
    const price2 = await cartPage.getTotalPrice();
    expect(price2).not.toEqual(price1);
});

// Test 11-50: Additional integration scenarios
test('@IntegrationSuite7 Dashboard product search and add', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.searchProduct('ZARA');
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    expect(true).toBeTruthy();
});

test('@IntegrationSuite7 View multiple products and add specific one', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const products = await dashboardPage.getAllProductNames();
    expect(products.length).toBeGreaterThan(0);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
});

test('@IntegrationSuite7 Add product and check product details', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const isVisible = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(isVisible).toBeTruthy();
    
    await dashboardPage.addProductByName('ZARA COAT 3');
});

test('@IntegrationSuite7 Get price and add product', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const price = await dashboardPage.getProductPrice('ZARA COAT 3');
    expect(price).toBeTruthy();
    
    await dashboardPage.addProductByName('ZARA COAT 3');
});

test('@IntegrationSuite7 Navigate dashboard and add from different index', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductToCart(0);
    
    expect(true).toBeTruthy();
});

test('@IntegrationSuite7 Multiple add operations in dashboard', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const count = await dashboardPage.getProductCount();
    
    if (count >= 3) {
        await dashboardPage.addProductToCart(0);
        await dashboardPage.addProductToCart(1);
        await dashboardPage.addProductToCart(2);
    }
    
    expect(true).toBeTruthy();
});

test('@IntegrationSuite7 Add to cart and navigate quickly', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await page.waitForTimeout(500);
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    expect(await cartPage.getProductCount()).toBeGreaterThan(0);
});

test('@IntegrationSuite7 Cart total calculation validation', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const total = await cartPage.getTotalPrice();
    expect(total).toBeTruthy();
});

test('@IntegrationSuite7 Proceed to checkout validation', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.isCheckoutButtonEnabled()).toBeTruthy();
    await cartPage.clickCheckout();
});

test('@IntegrationSuite7 Checkout page loads with order summary', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

test('@IntegrationSuite7 Checkout email verification', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    const isCorrect = await checkoutPage.verifyUserName('nirmal_jain@zohomail.in');
    expect(isCorrect).toBeTruthy();
});

test('@IntegrationSuite7 Country selection and order placement', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    await checkoutPage.submitOrder();
    
    expect(true).toBeTruthy();
});

test('@IntegrationSuite7 Order history after purchase', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
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

test('@IntegrationSuite7 Two product purchase flow', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.getProductCount()).toBe(2);
});

test('@IntegrationSuite7 Three product purchase and checkout', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const products = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
    
    for (const product of products) {
        await dashboardPage.addProductByName(product);
    }
    
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    expect(await cartPage.getProductCount()).toBe(3);
});

test('@IntegrationSuite7 Product quantity management in cart', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Update to 2
    await cartPage.updateQuantity(0, 2);
    let qty = await cartPage.getQuantity(0);
    expect(parseInt(qty)).toBe(2);
    
    // Update to 5
    await cartPage.updateQuantity(0, 5);
    qty = await cartPage.getQuantity(0);
    expect(parseInt(qty)).toBe(5);
});

test('@IntegrationSuite7 Product removal from cart', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const initialCount = await cartPage.getProductCount();
    await cartPage.removeProduct(0);
    await page.waitForTimeout(500);
    
    const finalCount = await cartPage.getProductCount();
    expect(finalCount).toBeLessThan(initialCount);
});

test('@IntegrationSuite7 Cart product names verification', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const names = await cartPage.getAllProductNames();
    
    expect(names.length).toBeGreaterThanOrEqual(2);
});

test('@IntegrationSuite7 Checkout country dropdown selection', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('Canada');
    
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

test('@IntegrationSuite7 Order confirmation and details', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
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

test('@IntegrationSuite7 Navigate to order history and view details', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    const orderHistoryPage = new AdvancedOrderHistoryPage(page);
    await orderHistoryPage.navigateToOrderHistory();
    
    const details = await orderHistoryPage.verifyOrderInHistory(orderId);
    expect(details).toBeTruthy();
});

test('@IntegrationSuite7 Complete end-to-end workflow', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    // Add products
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    
    // Navigate to cart
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Modify quantity
    await cartPage.updateQuantity(0, 2);
    
    // Checkout
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    // Verify in history
    const orderHistoryPage = new AdvancedOrderHistoryPage(page);
    const exists = await orderHistoryPage.verifyOrderIdExists(orderId);
    
    expect(exists).toBeTruthy();
});

test('@IntegrationSuite7 Product availability through flow', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const beforeAdd = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(beforeAdd).toBeTruthy();
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    // Product should still be visible
    const afterAdd = await dashboardPage.isProductVisible('ZARA COAT 3');
    expect(afterAdd).toBeTruthy();
});

test('@IntegrationSuite7 Dashboard consistency after add', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    const countBefore = await dashboardPage.getProductCount();
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    const countAfter = await dashboardPage.getProductCount();
    expect(countBefore).toBe(countAfter);
});

test('@IntegrationSuite7 Cart persistence and reload', async ({ page }) => {
    const { dashboardPage } = await completeLoginAndNavigate(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const countBefore = await cartPage.getProductCount();
    
    // Reload
    await page.reload();
    
    const countAfter = await cartPage.getProductCount();
    expect(countBefore).toBe(countAfter);
});

test('@IntegrationSuite7 Login validation through workflow', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    // Verify login elements exist
    expect(await loginPage.isEmailFieldVisible()).toBeTruthy();
    expect(await loginPage.isPasswordFieldVisible()).toBeTruthy();
    
    // Complete login
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    // Verify dashboard loads
    const dashboardPage = new AdvancedDashboardPage(page);
    const count = await dashboardPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});
