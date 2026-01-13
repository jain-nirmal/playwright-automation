class AdvancedCartPage {
    constructor(page) {
        this.page = page;
        this.product = page.locator("div li").first();
        this.productContainer = page.locator("div li");
        this.productName = page.locator("h3");
        this.productQuantity = page.locator("input[type='number']");
        this.productPrice = page.locator(".price");
        this.removeButton = page.locator("button:has-text('Remove')");
        this.checkoutButton = page.locator("text=Checkout");
        this.emptyCartMessage = page.locator("text=Your cart is empty");
        this.totalPrice = page.locator("[class*='total']");
        this.cartBadge = page.locator("[class*='badge']");
        this.continueShoppingButton = page.locator("text=Continue Shopping");
        this.couponInput = page.locator("[placeholder*='coupon']");
        this.applyCouponButton = page.locator("text=Apply Coupon");
        this.discountAmount = page.locator("[class*='discount']");
    }

    async validateProductIsDisplayed(productName) {
        await this.product.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        return bool;
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }

    async getProductLocator(productName) {
        return this.page.locator("h3:has-text('" + productName + "')");
    }

    async getProductCount() {
        return await this.productContainer.count();
    }

    async removeProduct(index) {
        await this.removeButton.nth(index).click();
    }

    async removeProductByName(productName) {
        const count = await this.productContainer.count();
        for (let i = 0; i < count; ++i) {
            const text = await this.productContainer.nth(i).locator("h3").textContent();
            if (text.includes(productName)) {
                await this.removeButton.nth(i).click();
                break;
            }
        }
    }

    async updateQuantity(index, quantity) {
        await this.productQuantity.nth(index).clear();
        await this.productQuantity.nth(index).fill(String(quantity));
    }

    async getQuantity(index) {
        return await this.productQuantity.nth(index).inputValue();
    }

    async getTotalPrice() {
        return await this.totalPrice.textContent();
    }

    async getAllProductNames() {
        return await this.productName.allTextContents();
    }

    async isEmptyCartMessageDisplayed() {
        return await this.emptyCartMessage.isVisible().catch(() => false);
    }

    async applyCoupon(couponCode) {
        if (await this.couponInput.isVisible()) {
            await this.couponInput.fill(couponCode);
            await this.applyCouponButton.click();
        }
    }

    async getDiscountAmount() {
        return await this.discountAmount.textContent().catch(() => null);
    }

    async isCheckoutButtonVisible() {
        return await this.checkoutButton.isVisible();
    }

    async isCheckoutButtonEnabled() {
        return await this.checkoutButton.isEnabled();
    }

    async continueShopping() {
        if (await this.continueShoppingButton.isVisible()) {
            await this.continueShoppingButton.click();
        }
    }

    async getProductPrice(index) {
        return await this.productPrice.nth(index).textContent();
    }

    async waitForCartToLoad() {
        await this.product.waitFor();
    }
}

module.exports = { AdvancedCartPage };
