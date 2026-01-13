class AdvancedCheckoutPage {
    constructor(page) {
        this.page = page;
        this.countryInput = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.userNameText = page.locator(".user__name [type='text']").first();
        this.submitButton = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
        this.orderConfirmationDetails = page.locator("[class*='confirmation']");
        this.emailDisplay = page.locator("[class*='email']");
        this.totalAmount = page.locator("[class*='total']");
        this.discountDisplay = page.locator("[class*='discount']");
        this.taxDisplay = page.locator("[class*='tax']");
        this.shippingAddress = page.locator("[class*='address']");
        this.paymentMethod = page.locator("[class*='payment']");
        this.cvvInput = page.locator("[placeholder*='CVV']");
        this.cardNumberInput = page.locator("[placeholder*='Card Number']");
        this.expiryInput = page.locator("[placeholder*='Expiry']");
        this.nameOnCardInput = page.locator("[placeholder*='Name on Card']");
        this.submitPaymentButton = page.locator("text=Place Order");
        this.termCheckbox = page.locator("[class*='terms']");
    }

    async selectCountryDropDown(country = "India") {
        await this.countryInput.pressSequentially(country.substring(0, 3).toLowerCase());
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator("button").count();
        
        for (let i = 0; i < optionsCount; ++i) {
            const text = await this.dropdown.locator("button").nth(i).textContent();
            if (text.includes(country)) {
                await this.dropdown.locator("button").nth(i).click();
                break;
            }
        }
    }

    async verifyUserName(email) {
        const text = await this.userNameText.textContent();
        return text.includes(email);
    }

    async submitOrder() {
        await this.submitButton.click();
    }

    async submitOrderandGetOrderId() {
        await this.submitButton.click();
        await this.orderConfirmationText.waitFor();
        const orderId = await this.orderId.textContent();
        return orderId;
    }

    async getOrderConfirmationMessage() {
        return await this.orderConfirmationText.textContent();
    }

    async getOrderId() {
        return await this.orderId.textContent();
    }

    async fillCardDetails(cardNumber, expiry, cvv, nameOnCard) {
        if (await this.cardNumberInput.isVisible()) {
            await this.cardNumberInput.fill(cardNumber);
        }
        if (await this.expiryInput.isVisible()) {
            await this.expiryInput.fill(expiry);
        }
        if (await this.cvvInput.isVisible()) {
            await this.cvvInput.fill(cvv);
        }
        if (await this.nameOnCardInput.isVisible()) {
            await this.nameOnCardInput.fill(nameOnCard);
        }
    }

    async acceptTerms() {
        if (await this.termCheckbox.isVisible()) {
            await this.termCheckbox.click();
        }
    }

    async isSubmitButtonEnabled() {
        return await this.submitButton.isEnabled();
    }

    async isCountryFieldVisible() {
        return await this.countryInput.isVisible();
    }

    async getTotalAmount() {
        return await this.totalAmount.textContent();
    }

    async getDiscountAmount() {
        return await this.discountDisplay.textContent().catch(() => "0");
    }

    async getTaxAmount() {
        return await this.taxDisplay.textContent().catch(() => "0");
    }

    async getUserEmail() {
        return await this.userNameText.textContent();
    }

    async selectPaymentMethod(method) {
        const paymentOption = this.page.locator(`text=${method}`);
        if (await paymentOption.isVisible()) {
            await paymentOption.click();
        }
    }

    async waitForCheckoutPageToLoad() {
        await this.countryInput.waitFor();
    }
}

module.exports = { AdvancedCheckoutPage };
