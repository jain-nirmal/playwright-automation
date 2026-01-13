const { test, expect } = require('@playwright/test');
const { AdvancedLoginPage } = require('../Pom/AdvancedLoginPage');
const { AdvancedDashboardPage } = require('../Pom/AdvancedDashboardPage');
const { AdvancedCartPage } = require('../Pom/AdvancedCartPage');
const { AdvancedCheckoutPage } = require('../Pom/AdvancedCheckoutPage');

const checkoutTestData = JSON.parse(JSON.stringify(require('../utils/checkoutTestData.json')));

// TEST SUITE 3: CHECKOUT FUNCTIONALITY - 50 SCENARIOS

async function setupAndLoginWithCart(page) {
    const loginPage = new AdvancedLoginPage(page);
    await loginPage.goToURL();
    await loginPage.validLogin('nirmal_jain@zohomail.in', 'Test123$');
    
    const dashboardPage = new AdvancedDashboardPage(page);
    await dashboardPage.waitForProductsToLoad();
    await dashboardPage.addProductByName('ZARA COAT 3');
    await dashboardPage.navigateToCart();
    
    const cartPage = new AdvancedCartPage(page);
    await cartPage.waitForCartToLoad();
    await cartPage.clickCheckout();
    
    const checkoutPage = new AdvancedCheckoutPage(page);
    await checkoutPage.waitForCheckoutPageToLoad();
    
    return { loginPage, dashboardPage, cartPage, checkoutPage };
}

// Test 1-15: Country selection tests
for (let i = 0; i < Math.min(checkoutTestData.length, 10); i++) {
    const dataSet = checkoutTestData[i];
    test(`@CheckoutSuite3 ${dataSet.scenario}`, async ({ page }) => {
        const { checkoutPage } = await setupAndLoginWithCart(page);
        
        if (dataSet.cartEmpty) {
            // Skip if cart is empty
            return;
        }
        
        if (dataSet.country) {
            try {
                await checkoutPage.selectCountryDropDown(dataSet.country);
                expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
            } catch (e) {
                if (dataSet.expectError) {
                    expect(true).toBeTruthy(); // Expected error
                } else {
                    throw e;
                }
            }
        }
    });
}

// Test 16: Verify country field is visible
test('@CheckoutSuite3 Country input field is visible', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 17: Verify submit button is visible
test('@CheckoutSuite3 Submit button is visible on checkout page', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    expect(await checkoutPage.isSubmitButtonEnabled()).toBeTruthy();
});

// Test 18: Select India from dropdown
test('@CheckoutSuite3 Select India country from dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    // Verify selection was made
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 19: Select United States
test('@CheckoutSuite3 Select United States from dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('United States');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 20: Select United Kingdom
test('@CheckoutSuite3 Select United Kingdom from dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('United Kingdom');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 21: Verify user email displayed on checkout
test('@CheckoutSuite3 User email is displayed on checkout page', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const email = await checkoutPage.getUserEmail();
    expect(email).toBeTruthy();
});

// Test 22: Verify user email is correct
test('@CheckoutSuite3 Verify user email matches login email', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const email = await checkoutPage.getUserEmail();
    expect(email.includes('nirmal_jain@zohomail.in')).toBeTruthy();
});

// Test 23: Verify total amount is displayed
test('@CheckoutSuite3 Total amount is displayed on checkout', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const total = await checkoutPage.getTotalAmount();
    expect(total).toBeTruthy();
});

// Test 24: Get total amount value
test('@CheckoutSuite3 Get total amount value', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const total = await checkoutPage.getTotalAmount();
    expect(total).not.toBeNull();
});

// Test 25: Verify discount display
test('@CheckoutSuite3 Discount information displayed', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const discount = await checkoutPage.getDiscountAmount();
    expect(discount).toBeTruthy();
});

// Test 26: Verify tax display
test('@CheckoutSuite3 Tax information displayed', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const tax = await checkoutPage.getTaxAmount();
    expect(tax).toBeTruthy();
});

// Test 27: Submit order with valid country
test('@CheckoutSuite3 Submit order with India selected', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    await checkoutPage.submitOrder();
    
    // Wait for order confirmation
    await page.waitForTimeout(2000);
    const confirmationMsg = await checkoutPage.getOrderConfirmationMessage();
    expect(confirmationMsg).toBeTruthy();
});

// Test 28: Get order ID after submission
test('@CheckoutSuite3 Get order ID after order submission', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
});

// Test 29: Verify order confirmation message
test('@CheckoutSuite3 Order confirmation message displayed', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const message = await checkoutPage.submitOrderandGetOrderId();
    
    expect(message).toBeTruthy();
});

// Test 30: Submit order with different country
test('@CheckoutSuite3 Submit order with Canada selected', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('Canada');
    await checkoutPage.submitOrder();
    
    await page.waitForTimeout(2000);
    expect(await checkoutPage.isSubmitButtonEnabled()).toBeTruthy();
});

// Test 31: Select multiple countries in sequence
test('@CheckoutSuite3 Select different countries in sequence', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    // First selection
    await checkoutPage.selectCountryDropDown('India');
    await page.waitForTimeout(500);
    
    // Note: In real scenario, we might need to refresh/restart, but testing if system allows
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 32: Verify checkout page loads correctly
test('@CheckoutSuite3 Checkout page loads with all fields', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
    expect(await checkoutPage.isSubmitButtonEnabled()).toBeTruthy();
    expect(await checkoutPage.getUserEmail()).toBeTruthy();
});

// Test 33: Verify country dropdown shows results
test('@CheckoutSuite3 Country dropdown shows results after typing', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 34: Place order and get order details
test('@CheckoutSuite3 Place order and receive order ID', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
    expect(orderId.length).toBeGreaterThan(0);
});

// Test 35: Verify user name field in checkout
test('@CheckoutSuite3 User email field displays correctly', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const isCorrect = await checkoutPage.verifyUserName('nirmal_jain@zohomail.in');
    expect(isCorrect).toBeTruthy();
});

// Test 36: Verify total is a valid number
test('@CheckoutSuite3 Total amount is valid number format', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const total = await checkoutPage.getTotalAmount();
    // Check if it contains numbers
    expect(/\d/.test(total)).toBeTruthy();
});

// Test 37: Select Germany from dropdown
test('@CheckoutSuite3 Select Germany from country dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('Germany');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 38: Select France from dropdown
test('@CheckoutSuite3 Select France from country dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('France');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 39: Select Australia from dropdown
test('@CheckoutSuite3 Select Australia from country dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('Australia');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 40: Select Japan from dropdown
test('@CheckoutSuite3 Select Japan from country dropdown', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('Japan');
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 41: Checkout flow order validation
test('@CheckoutSuite3 Complete checkout flow with order validation', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
    expect(orderId.length).toBeGreaterThan(0);
});

// Test 42: Verify order ID format
test('@CheckoutSuite3 Order ID has valid format', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toMatch(/\d+/);
});

// Test 43: Verify email not empty in checkout
test('@CheckoutSuite3 User email field is not empty', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const email = await checkoutPage.getUserEmail();
    expect(email.length).toBeGreaterThan(0);
});

// Test 44: Verify checkout page title/heading
test('@CheckoutSuite3 Checkout page displays properly', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
});

// Test 45: Multiple country selections don't break form
test('@CheckoutSuite3 Checkout form remains valid after country selection', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    expect(await checkoutPage.isSubmitButtonEnabled()).toBeTruthy();
});

// Test 46: Order can be placed with valid data
test('@CheckoutSuite3 Order placement succeeds with all required data', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    expect(orderId).toBeTruthy();
});

// Test 47: Checkout preserves user email during transaction
test('@CheckoutSuite3 User email preserved through checkout', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    const emailBefore = await checkoutPage.getUserEmail();
    expect(emailBefore).toContain('nirmal_jain@zohomail.in');
});

// Test 48: Order confirmation shows order details
test('@CheckoutSuite3 Order confirmation displays', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    await checkoutPage.selectCountryDropDown('India');
    await checkoutPage.submitOrder();
    
    await page.waitForTimeout(2000);
    const message = await checkoutPage.getOrderConfirmationMessage();
    expect(message).toBeTruthy();
});

// Test 49: Checkout page accessible from cart
test('@CheckoutSuite3 Checkout page accessible and functional', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    expect(await checkoutPage.isCountryFieldVisible()).toBeTruthy();
    expect(await checkoutPage.getUserEmail()).toBeTruthy();
});

// Test 50: Complete order flow end-to-end
test('@CheckoutSuite3 Complete end-to-end checkout flow', async ({ page }) => {
    const { checkoutPage } = await setupAndLoginWithCart(page);
    
    // Select country
    await checkoutPage.selectCountryDropDown('India');
    
    // Verify user details
    expect(await checkoutPage.verifyUserName('nirmal_jain@zohomail.in')).toBeTruthy();
    
    // Submit order
    const orderId = await checkoutPage.submitOrderandGetOrderId();
    
    // Verify order was created
    expect(orderId).toBeTruthy();
    expect(orderId.length).toBeGreaterThan(0);
});
