class AdvancedLoginPage {
    constructor(page) {
        this.page = page;
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
        this.loginButton = page.locator("[value='Login']");
        this.forgotPasswordLink = page.locator("a:has-text('Forgot password')");
        this.signupLink = page.locator("a:has-text('Signin')");
        this.errorMessage = page.locator("[class*='error']");
        this.toastMessage = page.locator(".toast-message");
        this.loadingSpinner = page.locator("[class*='spinner']");
    }

    async goToURL() {
        await this.page.goto("https://rahulshettyacademy.com/client");
        await this.page.waitForLoadState('networkidle');
    }

    async validLogin(email, password) {
        await this.userName.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillEmail(email) {
        await this.userName.fill(email);
    }

    async fillPassword(password) {
        await this.password.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async clearEmail() {
        await this.userName.clear();
    }

    async clearPassword() {
        await this.password.clear();
    }

    async getErrorMessage() {
        await this.errorMessage.waitFor({ timeout: 5000 }).catch(() => null);
        return await this.errorMessage.textContent().catch(() => null);
    }

    async isLoginButtonEnabled() {
        return await this.loginButton.isEnabled();
    }

    async isEmailFieldVisible() {
        return await this.userName.isVisible();
    }

    async isPasswordFieldVisible() {
        return await this.password.isVisible();
    }

    async getEmailValue() {
        return await this.userName.inputValue();
    }

    async getPasswordValue() {
        return await this.password.inputValue();
    }

    async pressTabInEmail() {
        await this.userName.press('Tab');
    }

    async pressTabInPassword() {
        await this.password.press('Tab');
    }

    async getLoginButtonText() {
        return await this.loginButton.inputValue();
    }
}

module.exports = { AdvancedLoginPage };
