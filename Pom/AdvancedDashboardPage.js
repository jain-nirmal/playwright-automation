class AdvancedDashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.productContainer = page.locator(".container-fluid");
        this.addToCartButton = page.locator("text=Add To Cart");
        this.productPrice = page.locator(".card-body .price");
        this.productImage = page.locator(".card-body img");
        this.sortDropdown = page.locator("[class*='sort']");
        this.filterOptions = page.locator("[class*='filter']");
        this.searchBox = page.locator("[placeholder*='search']");
        this.wishlistButton = page.locator("[class*='wishlist']");
        this.loadingSpinner = page.locator("[class*='spinner']");
        this.pageTitle = page.locator("h1, h2, [class*='title']");
    }

    async searchProductText(productName) {
        await this.productsText.first().waitFor();
        const titles = await this.productsText.allTextContents();
        const count = await this.products.count();
        
        for (let i = 0; i < count; ++i) {
            const text = await this.products.nth(i).locator("b").textContent();
            if (text === productName) {
                await this.products.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart() {
        await this.cart.click();
    }

    async getProductCount() {
        await this.productsText.first().waitFor();
        return await this.products.count();
    }

    async getAllProductNames() {
        await this.productsText.first().waitFor();
        return await this.productsText.allTextContents();
    }

    async getAllProductPrices() {
        await this.productPrice.first().waitFor();
        return await this.productPrice.allTextContents();
    }

    async getProductByIndex(index) {
        return await this.products.nth(index).textContent();
    }

    async addProductToCart(index) {
        await this.products.nth(index).locator("text=Add To Cart").click();
    }

    async addProductByName(productName) {
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) {
            const text = await this.products.nth(i).locator("b").textContent();
            if (text === productName) {
                await this.products.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }

    async isProductVisible(productName) {
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) {
            const text = await this.products.nth(i).locator("b").textContent();
            if (text === productName) {
                return true;
            }
        }
        return false;
    }

    async getProductPrice(productName) {
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) {
            const text = await this.products.nth(i).locator("b").textContent();
            if (text === productName) {
                return await this.products.nth(i).locator(".price").textContent();
            }
        }
        return null;
    }

    async waitForProductsToLoad() {
        await this.productsText.first().waitFor();
    }

    async clickProductImage(index) {
        await this.productImage.nth(index).click();
    }

    async isCartIconVisible() {
        return await this.cart.isVisible();
    }

    async searchProduct(searchTerm) {
        if (await this.searchBox.isVisible()) {
            await this.searchBox.fill(searchTerm);
            await this.page.waitForLoadState('networkidle');
        }
    }
}

module.exports = { AdvancedDashboardPage };
