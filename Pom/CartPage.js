const {test, expect} = require('@playwright/test');

class CartPage {
    constructor(page) {


        this.page=page;

        this.product = page.locator("div li").first();
        this.productName = page.locator("h3:has-text('ZARA COAT 3')");
        this.checkOut = page.locator("text=Checkout")


    }

    async validateProductisDisplayed(productName) {
        await this.product.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy();

    }
    async clickCheckout() {
        await this.checkOut.click();
    }
    getProductLocator(ProuctName) {
        return this.page.locator("h3:has-text('" + ProuctName + "')");
    }

}module.exports = { CartPage };