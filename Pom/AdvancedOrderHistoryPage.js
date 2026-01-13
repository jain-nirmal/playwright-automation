class AdvancedOrderHistoryPage {
    constructor(page) {
        this.page = page;
        this.myOrdersButton = page.locator("button[routerlink*='myorders']");
        this.orderHistoryTable = page.locator("tbody");
        this.orderRow = page.locator("tbody tr");
        this.orderIdCell = page.locator("tbody tr th");
        this.viewDetailsButton = page.locator("button:has-text('View')");
        this.downloadInvoiceButton = page.locator("button:has-text('Download')");
        this.orderStatus = page.locator("[class*='status']");
        this.orderDate = page.locator("[class*='date']");
        this.orderAmount = page.locator("[class*='amount']");
        this.orderDetails = page.locator(".col-text");
        this.orderItemContainer = page.locator("[class*='item']");
        this.backButton = page.locator("text=Back");
        this.noOrdersMessage = page.locator("text=No orders");
        this.searchOrderBox = page.locator("[placeholder*='search']");
        this.filterByStatus = page.locator("[class*='filter']");
    }

    async navigateToOrderHistory() {
        await this.myOrdersButton.click();
    }

    async waitForOrderHistoryToLoad() {
        await this.orderHistoryTable.waitFor();
    }

    async verifyOrderInHistory(orderId) {
        await this.navigateToOrderHistory();
        await this.waitForOrderHistoryToLoad();
        const rows = await this.orderRow;
        
        for (let i = 0; i < await rows.count(); ++i) {
            const rowOrderId = await rows.nth(i).locator("th").textContent();
            if (orderId.includes(rowOrderId)) {
                await rows.nth(i).locator("button").first().click();
                break;
            }
        }
        
        const orderIdDetails = await this.orderDetails.textContent();
        return orderIdDetails;
    }

    async getOrderCount() {
        await this.waitForOrderHistoryToLoad();
        return await this.orderRow.count();
    }

    async getOrderByIndex(index) {
        const row = this.orderRow.nth(index);
        return await row.textContent();
    }

    async getOrderIdByIndex(index) {
        const row = this.orderRow.nth(index);
        return await row.locator("th").textContent();
    }

    async getOrderStatusByIndex(index) {
        const row = this.orderRow.nth(index);
        return await row.locator("[class*='status']").textContent().catch(() => null);
    }

    async viewOrderDetails(index) {
        await this.orderRow.nth(index).locator("button").first().click();
    }

    async downloadInvoice(index) {
        const downloadButton = this.orderRow.nth(index).locator("button:has-text('Download')");
        if (await downloadButton.isVisible()) {
            await downloadButton.click();
        }
    }

    async searchOrder(orderId) {
        if (await this.searchOrderBox.isVisible()) {
            await this.searchOrderBox.fill(orderId);
            await this.page.waitForLoadState('networkidle');
        }
    }

    async filterByOrderStatus(status) {
        if (await this.filterByStatus.isVisible()) {
            await this.filterByStatus.selectOption(status);
            await this.page.waitForLoadState('networkidle');
        }
    }

    async isNoOrdersMessageDisplayed() {
        return await this.noOrdersMessage.isVisible().catch(() => false);
    }

    async goBack() {
        if (await this.backButton.isVisible()) {
            await this.backButton.click();
        }
    }

    async getAllOrderIds() {
        await this.waitForOrderHistoryToLoad();
        return await this.orderIdCell.allTextContents();
    }

    async verifyOrderIdExists(orderId) {
        const rows = await this.orderRow;
        for (let i = 0; i < await rows.count(); ++i) {
            const rowOrderId = await rows.nth(i).locator("th").textContent();
            if (rowOrderId.includes(orderId)) {
                return true;
            }
        }
        return false;
    }

    async getOrderDetailsText() {
        return await this.orderDetails.allTextContents();
    }
}

module.exports = { AdvancedOrderHistoryPage };
