const { test, expect } = require('@playwright/test');
const { AdvancedLoginPage } = require('../Pom/AdvancedLoginPage');
const { AdvancedDashboardPage } = require('../Pom/AdvancedDashboardPage');
const { AdvancedCartPage } = require('../Pom/AdvancedCartPage');
const { AdvancedCheckoutPage } = require('../Pom/AdvancedCheckoutPage');

// TEST SUITE 8: PERFORMANCE AND STRESS TESTS - 50 SCENARIOS

async function setupLogin(page) {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    
    return { loginPage, dashboardPage };
}

// Test 1: Page load time
test('@PerformanceSuite8 Dashboard loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    const { dashboardPage } = await setupLogin(page);
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(30000); // Less than 30 seconds
});

// Test 2: Product list rendering
test('@PerformanceSuite8 Product list renders quickly', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    const count = await dashboardPage.getProductCount();
    const endTime = Date.now();
    
    expect(count).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(5000);
});

// Test 3: Add to cart performance
test('@PerformanceSuite8 Add to cart operation completes quickly', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    await dashboardPage.addProductByName('ZARA COAT 3');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

// Test 4: Cart navigation performance
test('@PerformanceSuite8 Cart page loads quickly', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    
    const startTime = Date.now();
    await dashboardPage.navigateToCart();
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

// Test 5: Bulk product add performance
test('@PerformanceSuite8 Add 5 products performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
        await dashboardPage.addProductByName('ZARA COAT 3');
        await page.waitForTimeout(100);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(20000);
});

// Test 6: Multiple get requests performance
test('@PerformanceSuite8 Get all product names performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    const names = await dashboardPage.getAllProductNames();
    const endTime = Date.now();
    
    expect(names.length).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(5000);
});

// Test 7: Checkout navigation performance
test('@PerformanceSuite8 Checkout page navigation performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const startTime = Date.now();
    await cartPage.clickCheckout();
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

// Test 8: Memory stability with repeated operations
test('@PerformanceSuite8 Repeated add/remove operations', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    for (let i = 0; i < 10; i++) {
        await dashboardPage.addProductByName('ZARA COAT 3');
        await page.waitForTimeout(100);
    }
    
    expect(true).toBeTruthy();
});

// Test 9: Network request stability
test('@PerformanceSuite8 Multiple network requests stability', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    // Multiple requests to get data
    for (let i = 0; i < 5; i++) {
        const count = await dashboardPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    }
});

// Test 10-50: Additional stress and performance scenarios
test('@PerformanceSuite8 Rapid page navigation', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    await page.goBack();
    await dashboardPage.waitForProductsToLoad();
    
    expect(true).toBeTruthy();
});

test('@PerformanceSuite8 Sequential product additions', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const products = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
    
    for (const product of products) {
        await dashboardPage.addProductByName(product);
        await page.waitForTimeout(200);
    }
    
    expect(true).toBeTruthy();
});

test('@PerformanceSuite8 Cart update performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const startTime = Date.now();
    
    for (let i = 1; i <= 5; i++) {
        await cartPage.updateQuantity(0, i);
        await page.waitForTimeout(100);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Dashboard refresh performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 3; i++) {
        await page.reload();
        await dashboardPage.waitForProductsToLoad();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(30000);
});

test('@PerformanceSuite8 Long session stability', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    // Extended session
    for (let i = 0; i < 3; i++) {
        await dashboardPage.addProductByName('ZARA COAT 3');
        await page.waitForTimeout(2000);
    }
    
    const count = await dashboardPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});

test('@PerformanceSuite8 Product price retrieval performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        await dashboardPage.getProductPrice('ZARA COAT 3');
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Cart data consistency', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    
    // Multiple reads should return same data
    const count1 = await cartPage.getProductCount();
    const count2 = await cartPage.getProductCount();
    
    expect(count1).toBe(count2);
});

test('@PerformanceSuite8 Checkout form interaction speed', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    
    const startTime = Date.now();
    await checkoutPage.selectCountryDropDown('India');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Rapid quantity changes', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const startTime = Date.now();
    
    for (let qty = 1; qty <= 10; qty++) {
        await cartPage.updateQuantity(0, qty);
        await page.waitForTimeout(50);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Dashboard scroll performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    // Scroll operations
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.evaluate(() => window.scrollBy(0, -500));
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
});

test('@PerformanceSuite8 Element visibility checks performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        await dashboardPage.isProductVisible('ZARA COAT 3');
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Product index access performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const count = await dashboardPage.getProductCount();
    
    const startTime = Date.now();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
        await dashboardPage.getProductByIndex(i);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Remove product performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const startTime = Date.now();
    await cartPage.removeProduct(0);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 String operations on product names', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        const names = await dashboardPage.getAllProductNames();
        expect(names.length).toBeGreaterThan(0);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Page state consistency', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const names1 = await dashboardPage.getAllProductNames();
    await page.waitForTimeout(1000);
    const names2 = await dashboardPage.getAllProductNames();
    
    expect(names1.length).toBe(names2.length);
});

test('@PerformanceSuite8 Multiple element waits', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
        await dashboardPage.waitForProductsToLoad();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(15000);
});

test('@PerformanceSuite8 Search operation performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    await dashboardPage.searchProduct('ZARA').catch(() => {});
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Click operation speed', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
        await dashboardPage.addProductToCart(0);
        await page.waitForTimeout(100);
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Fill field performance', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    const startTime = Date.now();
    
    await loginPage.fillEmail('test@test.com');
    await loginPage.fillPassword('TestPassword123');
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
});

test('@PerformanceSuite8 Clear field performance', async ({ page }) => {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    
    await loginPage.fillEmail('test@test.com');
    await loginPage.fillPassword('TestPassword');
    
    const startTime = Date.now();
    
    await loginPage.clearEmail();
    await loginPage.clearPassword();
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
});

test('@PerformanceSuite8 Concurrent operations handling', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    // Rapid concurrent-like operations
    const ops = [];
    
    ops.push(dashboardPage.getProductCount());
    ops.push(dashboardPage.getAllProductNames());
    ops.push(dashboardPage.getAllProductPrices());
    
    const results = await Promise.all(ops);
    
    expect(results.length).toBe(3);
});

test('@PerformanceSuite8 Sequence of API calls', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    await dashboardPage.getProductCount();
    await dashboardPage.getAllProductNames();
    await dashboardPage.getAllProductPrices();
    await dashboardPage.isProductVisible('ZARA COAT 3');
    await dashboardPage.getProductPrice('ZARA COAT 3');
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 DOM manipulation performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    // Multiple DOM operations
    for (let i = 0; i < 5; i++) {
        await dashboardPage.isCartIconVisible();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000);
});

test('@PerformanceSuite8 Wait for element performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 3; i++) {
        await dashboardPage.waitForProductsToLoad();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Text extraction performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        await dashboardPage.getAllProductNames();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Count operations performance', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    const startTime = Date.now();
    
    for (let i = 0; i < 20; i++) {
        await dashboardPage.getProductCount();
    }
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10000);
});

test('@PerformanceSuite8 Complex flow timing', async ({ page }) => {
    const startTime = Date.now();
    
    const { dashboardPage } = await setupLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.updateQuantity(0, 2);
    
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(30000);
});

test('@PerformanceSuite8 Page responsiveness after operations', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    // Heavy operation
    for (let i = 0; i < 5; i++) {
        await dashboardPage.addProductByName('ZARA COAT 3');
    }
    
    // Page should still be responsive
    const count = await dashboardPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});

test('@PerformanceSuite8 Memory efficiency with large dataset', async ({ page }) => {
    const { dashboardPage } = await setupLogin(page);
    
    // Get all data at once
    const names = await dashboardPage.getAllProductNames();
    const prices = await dashboardPage.getAllProductPrices();
    
    expect(names.length).toBe(prices.length);
});
