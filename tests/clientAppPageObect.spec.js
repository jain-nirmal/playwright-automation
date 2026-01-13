const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Pom/Loginpage');
const { DashboardPage } = require('../Pom/DashboardPage');
const { CartPage } = require('../Pom/CartPage');
const { CheckoutPage } = require('../Pom/CheckoutPage');
const { OrderHistory } = require('../Pom/OrderHistory'); 

const dataSet = require('../utils/placeOrderTestData.json');




test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage

   const loginPage=new LoginPage(page);
   const dashboardPage=new DashboardPage(page);
   const cartPage=new CartPage(page);
   const checkoutPage=new CheckoutPage(page); 
   const orderHistory=new OrderHistory(page);  

 
   //const products = page.locator(".card-body");

   await loginPage.goToURL();
   await loginPage.validLogin(dataSet.username,dataSet.password);
   await dashboardPage.searchProductText(dataSet.productName);
   await dashboardPage.navigatetoCart();
   await cartPage.validateProductisDisplayed(dataSet.productName);
   await cartPage.clickCheckout();
   await checkoutPage.selectCountryDropDown();
   await checkoutPage.verifyUserName(dataSet.username);
   const orderId=await checkoutPage.submitOrderandGetOrderId();
   const orderIdDetails = await orderHistory.verifyOrderInHistory(orderId);
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
 

});








