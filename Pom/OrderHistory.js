const {test, expect} = require('@playwright/test');
class OrderHistory {
    constructor(page){


        this.page=page;
        this.myordersButton=page.locator("button[routerlink*='myorders']");
        this.orderHistoryTable=page.locator("tbody");
        this.orderRow=page.locator("tbody tr")
        
    }


    async verifyOrderInHistory(orderId){
        await this.myordersButton.click();
        await this.orderHistoryTable.waitFor();
        const rows = await this.orderRow;
        for (let i = 0; i < await rows.count(); ++i) {
          const rowOrderId = await rows.nth(i).locator("th").textContent();
          if (orderId.includes(rowOrderId)) {
             await rows.nth(i).locator("button").first().click();
             break;
          }
       }
       const orderIdDetails = await this.page.locator(".col-text").textContent();
       return orderIdDetails;
     

    }


async getOrderId()
{
    return await this.orderdIdDetails.textContent();
}

} module.exports = { OrderHistory}



     
