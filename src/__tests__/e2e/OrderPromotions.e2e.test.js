import puppeteer from "puppeteer";
import { NavigateTo, launchOptions, delay, parseCurrency } from "../config";
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { preview } from 'vite';

describe('Promotion Tests', () => {
    let server;
    let browser;
    let page;

    // random port
    const port = Math.floor(Math.random() * 1000) + 3000;
    const pageUrl = `http://localhost:${port}`;
    beforeAll(async () => {
        server = await preview({ preview : { port }});
        browser = await puppeteer.launch(launchOptions);
        
        page = await browser.newPage();
  
        // Clear indexedDB
        await page.goto('chrome://indexeddb-internals');
        await page.evaluate(() => {
          try {
              indexedDB.deleteDatabase('ORDER_MANAGEMENT');
          } catch (e)
            {
                console.log(e);
            }
        });
        page.close();
        page = await browser.newPage();
        await page.goto(pageUrl, { waitUntil: 'networkidle0' }); 
        
  
    });
  
    afterAll(() => {
      browser.close();
      server.httpServer.close();
    });
  
    async function AddCustomer(customerName, phone) {
        await page.waitForSelector('button[data-test-id="add-new-order-btn"]', {timeout: 5000});
        page.$eval('button[data-test-id="add-new-order-btn"]', el => el.click());

        await page.waitForSelector('div[data-test-id="add-customer-form"]', {timeout: 5000});
        const addCustomerForm = await page.$('div[data-test-id="add-customer-form"]');
        const customerNameInput = await addCustomerForm.$('[data-test-id="customer-name-input"]');
        await customerNameInput.type(customerName);
        const customerPhoneInput = await addCustomerForm.$('[data-test-id="phone-input"]');
        await customerPhoneInput.type(phone);
        const confirmBtn = await addCustomerForm.$('[data-test-id="confirm-btn"]');
        await confirmBtn.click();
    }

    async function addItemsToOrder(itemIndex) {
        await page.waitForSelector('tr[data-test-id="menu-table-card"]', {timeout: 5000});
        const menuItems = await page.$$('tr[data-test-id="menu-table-card"]');
        const addToOrderBtn = await menuItems[itemIndex].$('td > button[data-test-id="add-to-order-btn"]');
        await addToOrderBtn.click();

        const price = await menuItems[itemIndex].$('td[data-test-id="menu-table-card-price"]');
        const priceText = await price.evaluate(price => price.innerText);

        // remove $ sign
        return parseInt(priceText.slice(1));
    }

    async function addToOrder() {
        const addToOrderForm = await page.$('div[data-test-id="add-to-order-form"]');
        const confirmBtn = await addToOrderForm.$('button[data-test-id="add-to-order-form-btn"]');
        await confirmBtn.click();
    }

    test("1. Add Promotion to Order subtract $10", async () => {
        await NavigateTo(page, "#Orders");
        await AddCustomer("Test Customer", "1234567890");

        await page.waitForSelector('div[data-test-id="add-to-order-form"]', {timeout: 5000});
        let total = 0;
        for (let i = 0; i < 5; i++) {
            total += await addItemsToOrder(2);
        }

        await page.waitForSelector('input#promotion');
        await page.$eval('input#promotion', el => el.value = '');
        const promotionInput = await page.$('input#promotion');
        await promotionInput.type('-10');
       
        await addToOrder();

        await page.waitForSelector('div[data-test-id="order-card"]', {timeout: 5000});
        const orderCard = await page.$('div[data-test-id="order-card"]');
        const orderTotal = await orderCard.$('[aria-label="total-payment-type"]');
        const orderTotalText = await orderTotal.evaluate(orderTotal => orderTotal.innerText);
        const orderTotalNumber = parseCurrency(orderTotalText);
        expect(orderTotalNumber).toBe(total - 10);

    },20_000);

    test("2. Add Promotion to Order subtract $20", async () => {
        await NavigateTo(page, "#Orders");
        await AddCustomer("Test Customer", "1234567890");

        await page.waitForSelector('div[data-test-id="add-to-order-form"]', {timeout: 5000});
        let total = 0;
        for (let i = 0; i < 5; i++) {
            total += await addItemsToOrder(2);
        }

        await page.waitForSelector('input#promotion');
        await page.$eval('input#promotion', el => el.value = '');
        const promotionInput = await page.$('input#promotion');
        await promotionInput.type('-20');
       
        await addToOrder();

        await page.waitForSelector('div[data-test-id="order-card"]', {timeout: 5000});
        const orderCard = await page.$('div[data-test-id="order-card"]');
        const orderTotal = await orderCard.$('[aria-label="total-payment-type"]');
        const orderTotalText = await orderTotal.evaluate(orderTotal => orderTotal.innerText);
        const orderTotalNumber = parseCurrency(orderTotalText);
        expect(orderTotalNumber).toBe(total - 20);

    },20_000);

    test("3. Add Promotion to Order subtract more than the total", async () => {
        await page.evaluate(() => {
            window.confirm = () => true;
            window.alert = () => true;
          });
        await NavigateTo(page, "#Orders");
        await AddCustomer("Test Customer", "1234567890");

        await page.waitForSelector('div[data-test-id="add-to-order-form"]', {timeout: 5000});
        let total = 0;
        for (let i = 0; i < 5; i++) {
            total += await addItemsToOrder(2);
        }

        await page.waitForSelector('input#promotion');
        await page.$eval('input#promotion', el => el.value = '');
        const promotionInput = await page.$('input#promotion');
        await promotionInput.type('-100');
        // does not take effect
        await addToOrder(); 

        // that is why we can still select the cancel button
        const cancelBtn = await page.waitForSelector('button[data-test-id="add-to-order-form-cancel-btn"]', {timeout: 5000});
        expect(cancelBtn).toBeTruthy();
        await cancelBtn.click();

        await page.waitForSelector('div[data-test-id="order-card"]', {timeout: 5000});
        const orderCards = await page.$$('div[data-test-id="order-card"]');
        expect(orderCards.length).toBe(2);
    });
});