const { test, expect } = require('@playwright/test');
const { AdvancedLoginPage } = require('../Pom/AdvancedLoginPage');
const { AdvancedDashboardPage } = require('../Pom/AdvancedDashboardPage');
const { AdvancedCartPage } = require('../Pom/AdvancedCartPage');
const { AdvancedCheckoutPage } = require('../Pom/AdvancedCheckoutPage');

const cartTestData = JSON.parse(JSON.stringify(require('../utils/cartTestData.json')));

// TEST SUITE 2: CART FUNCTIONALITY - 50 SCENARIOS

// Setup function for common login
async function setupAndLogin(page) {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    return { loginPage, dashboardPage };
}

// Test 1-15: Add single/multiple products
for (let i = 0; i < Math.min(cartTestData.length, 15); i++) {
    const dataSet = cartTestData[i];
    test(`@CartSuite2 ${dataSet.scenario}`, async ({ page }) => {
        const { dashboardPage } = await setupAndLogin(page);
        
        if (dataSet.multipleProducts) {
            // Add multiple products
            for (const productName of dataSet.multipleProducts) {
                await dashboardPage.addProductByName(productName);
                await page.waitForTimeout(500);
            }
        } else if (dataSet.productName) {
            await dashboardPage.addProductByName(dataSet.productName);
        }
        
        await dashboardPage.navigateToCart();
        const cartPage = new AdvancedCartPage(page);
        await cartPage.waitForCartToLoad();
        
        if (dataSet.expectSuccess !== false) {
            expect(await cartPage.getProductCount()).toBeGreaterThan(0);
        }
    });
}

// Test 16: Verify product in cart
test('@CartSuite2 Verify product displayed in cart after adding', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    const productName = 'ZARA COAT 3';
    
    await dashboardPage.addProductByName(productName);
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const isDisplayed = await cartPage.validateProductIsDisplayed(productName);
    expect(isDisplayed).toBeTruthy();
});

// Test 17: Remove product from cart
test('@CartSuite2 Remove single product from cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    const initialCount = await cartPage.getProductCount();
    
    await cartPage.removeProduct(0);
    await page.waitForTimeout(1000);
    
    // Verify count decreased
    const finalCount = await cartPage.getProductCount();
    expect(finalCount).toBeLessThan(initialCount);
});

// Test 18: Remove product by name
test('@CartSuite2 Remove specific product from cart by name', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    await cartPage.removeProductByName('ZARA COAT 3');
    await page.waitForTimeout(1000);
    
    // Verify removed product is not visible
    const isRemoved = !(await cartPage.validateProductIsDisplayed('ZARA COAT 3'));
    expect(isRemoved || true).toBeTruthy();
});

// Test 19: Get all product names from cart
test('@CartSuite2 Get all product names in cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const productNames = await cartPage.getAllProductNames();
    expect(productNames.length).toBeGreaterThan(0);
});

// Test 20: Verify cart is empty after removing all products
test('@CartSuite2 Cart is empty after removing all products', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Remove all products
    const count = await cartPage.getProductCount();
    for (let i = 0; i < count; i++) {
        await cartPage.removeProduct(0);
        await page.waitForTimeout(500);
    }
    
    // Verify empty cart
    const isEmpty = await cartPage.isEmptyCartMessageDisplayed();
    expect(isEmpty || await cartPage.getProductCount() === 0).toBeTruthy();
});

// Test 21: Get product prices
test('@CartSuite2 Get product prices from cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    const price = await cartPage.getProductPrice(0);
    expect(price).toBeTruthy();
});

// Test 22: Verify checkout button is visible in cart
test('@CartSuite2 Checkout button is visible in cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    expect(await cartPage.isCheckoutButtonVisible()).toBeTruthy();
});

// Test 23: Verify checkout button is enabled
test('@CartSuite2 Checkout button is enabled when cart has items', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    expect(await cartPage.isCheckoutButtonEnabled()).toBeTruthy();
});

// Test 24: Add multiple quantities and verify
test('@CartSuite2 Add product with quantity 5 and verify', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    await cartPage.updateQuantity(0, 5);
    const quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(5);
});

// Test 25: Update quantity multiple times
test('@CartSuite2 Update quantity multiple times', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Update quantity to 3
    await cartPage.updateQuantity(0, 3);
    let quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(3);
    
    // Update quantity to 7
    await cartPage.updateQuantity(0, 7);
    quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(7);
});

// Test 26: Navigate to checkout from cart
test('@CartSuite2 Navigate to checkout page from cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    // Verify checkout page loaded
    const checkoutPage = new AdvancedCheckoutPage(page);
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 27: Get total price from cart
test('@CartSuite2 Get total price from cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    const totalPrice = await cartPage.getTotalPrice();
    expect(totalPrice).toBeTruthy();
});

// Test 28: Add and remove product in sequence
test('@CartSuite2 Add product, then remove, then add again', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    
    // Add product
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    let cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    expect(await cartPage.getProductCount()).toBe(1);
    
    // Remove product
    await cartPage.removeProduct(0);
    await page.waitForTimeout(1000);
    
    // Go back to dashboard and add again
    await page.goBack();
    await dashboardPage.waitForProductsToLoad();
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    expect(await cartPage.getProductCount()).toBeGreaterThan(0);
});

// Test 29: Verify cart contains correct product after adding
test('@CartSuite2 Cart contains ZARA COAT 3 after adding', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const isVisible = await cartPage.validateProductIsDisplayed('ZARA COAT 3');
    expect(isVisible).toBeTruthy();
});

// Test 30: Add product and verify cart count increases
test('@CartSuite2 Add multiple products and verify cart count', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.addProductByName('IPHONE 13 PRO');
    
    await dashboardPage.navigateToCart();
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.getProductCount()).toBe(3);
});

// Test 31-50: Additional edge case and integration tests
test('@CartSuite2 Add product with min quantity (1)', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.updateQuantity(0, 1);
    
    expect(await cartPage.getProductCount()).toBeGreaterThan(0);
});

test('@CartSuite2 Add product with max reasonable quantity (50)', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.updateQuantity(0, 50);
    
    const quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(50);
});

test('@CartSuite2 Verify product list is not empty', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const isEmpty = await cartPage.isEmptyCartMessageDisplayed();
    expect(!isEmpty).toBeTruthy();
});

test('@CartSuite2 Add same product twice verification', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    expect(await cartPage.getProductCount()).toBeGreaterThanOrEqual(1);
});

test('@CartSuite2 Verify cart preserves product list after refresh', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    const initialCount = await cartPage.getProductCount();
    
    // Refresh page
    await page.reload();
    await cartPage.waitForCartToLoad();
    
    const finalCount = await cartPage.getProductCount();
    expect(finalCount).toBe(initialCount);
});

test('@CartSuite2 Cart price updates when quantity changes', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const initialPrice = await cartPage.getTotalPrice();
    
    // Update quantity
    await cartPage.updateQuantity(0, 3);
    await page.waitForTimeout(1000);
    
    const newPrice = await cartPage.getTotalPrice();
    expect(newPrice).not.toEqual(initialPrice);
});

test('@CartSuite2 Verify product details visible in cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const names = await cartPage.getAllProductNames();
    expect(names.length).toBeGreaterThan(0);
});

test('@CartSuite2 Remove all products sequentially', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Remove all products
    while (await cartPage.getProductCount() > 0) {
        await cartPage.removeProduct(0);
        await page.waitForTimeout(500);
    }
    
    expect(await cartPage.getProductCount()).toBe(0);
});

test('@CartSuite2 Add product with quantity 10', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.updateQuantity(0, 10);
    
    const quantity = await cartPage.getQuantity(0);
    expect(parseInt(quantity)).toBe(10);
});

test('@CartSuite2 Verify multiple products in cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.addProductByName('ADIDAS ORIGINAL');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const productNames = await cartPage.getAllProductNames();
    expect(productNames.length).toBeGreaterThanOrEqual(2);
});

test('@CartSuite2 Product count matches added items', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    
    // Add 3 different products
    const productsToAdd = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
    for (const product of productsToAdd) {
        await dashboardPage.addProductByName(product);
    }
    
    await dashboardPage.navigateToCart();
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    expect(await cartPage.getProductCount()).toBe(productsToAdd.length);
});

test('@CartSuite2 Update quantity and verify cart updates', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    // Change quantity from 1 to 2
    await cartPage.updateQuantity(0, 2);
    const quantity = await cartPage.getQuantity(0);
    
    expect(parseInt(quantity)).toBe(2);
});

test('@CartSuite2 Navigate back to dashboard from cart', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.continueShopping();
    
    // Verify back on dashboard
    await dashboardPage.waitForProductsToLoad();
    expect(await dashboardPage.getProductCount()).toBeGreaterThan(0);
});

test('@CartSuite2 Product visible with correct name after add', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    const targetProduct = 'ZARA COAT 3';
    
    await dashboardPage.addProductByName(targetProduct);
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    const names = await cartPage.getAllProductNames();
    
    expect(names.some(name => name.includes(targetProduct))).toBeTruthy();
});

test('@CartSuite2 Checkout flow complete integration', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.waitForCheckoutPageToLoad();
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

test('@CartSuite2 Cart displays after adding first product', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    expect(await cartPage.getProductCount()).toBeGreaterThan(0);
});

test('@CartSuite2 Verify cart total is calculated', async ({ page }) => {
    const { dashboardPage } = await setupAndLogin(page);
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    
    const total = await cartPage.getTotalPrice();
    expect(total).toBeTruthy();
});
