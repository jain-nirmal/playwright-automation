const {test, expect} = require('@playwright/test');
class CheckoutPage {
    constructor(page) {


        this.page=page;
        this.countryInput = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.userNameText = page.locator(".user__name [type='text']").first();
        this.submitButton = page.locator(".action__submit");
        this.orderConfirmationText = page.locator(".hero-primary");
        this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");

      
    }


    async selectCountryDropDown() {
        await this.countryInput.pressSequentially("ind");
        await this.dropdown.waitFor();
        const optionsCount = await this.dropdown.locator("button").count();
         for (let i = 0; i < optionsCount; ++i) {
               const text = await this.dropdown.locator("button").nth(i).textContent();
                if (text === " India") {
                        await this.dropdown.locator("button").nth(i).click();
                        break;
                }
            }
    }

    verifyUserName(email) {
        expect(this.userNameText).toHaveText(email);
    }

    async submitOrderandGetOrderId() {
        await this.submitButton.click();
        await this.orderConfirmationText.waitFor();
        await expect(this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        const orderId = await this.orderId.textContent();
        console.log("Order Id is: " + orderId);
        return orderId;
    }
} module.exports = { CheckoutPage };