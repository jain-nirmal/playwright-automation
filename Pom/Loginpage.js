class LoginPage {


    constructor(page) {


        this.page = page;
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
        this.loginButton = page.locator("[value='Login']");

    }


    async goToURL() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(email, password) {
        await this.userName.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        //await this.page.waitForLoadState('networkidle');

        
   
    }

} module.exports = { LoginPage };