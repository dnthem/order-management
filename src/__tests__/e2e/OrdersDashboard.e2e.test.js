import puppeteer from "puppeteer";
import { pageUrl, NavigateTo, parseCurrency, launchOptions } from "../config";
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { preview } from 'vite';
// Delay function
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}


describe('Order - Dashboard', () => {
    let server;
    let browser;
    let page;
    let totalIncome = 0;
    let totalItems = 0;
    let totalOrders = 0;

    beforeAll(async () => {
        server = await preview({ preview : { port : 3000 }});
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

    // Click add order button and add a customer 
    // and confirm
    async function AddCustomer(customerName, phone) {
        const btnAddOrder = await page.waitForSelector('button[data-test-id="add-new-order-btn"]');
        await btnAddOrder.click();
        const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');

        const customerNameInput = await addCustomerForm.$('input[data-test-id="customer-name-input"]');
        await customerNameInput.type(customerName);
        const customerPhoneInput = await addCustomerForm.$('input[data-test-id="phone-input"]');
        await customerPhoneInput.type(phone);
        const confirmBtn = await addCustomerForm.$('button[data-test-id="confirm-btn"]');
        await confirmBtn.click();
    }

    /**
     * Add items to order
     */
    async function addItemsToOrder(itemIndex) {
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


    test('1. Add 10 orders', async () => {
        await NavigateTo(page, '#Orders');
        await delay(100);
        // list customer names
        const customerNames = ['John', 'Mary', 'Bob', 'Alice', 'Jane', 'Joe', 'Sally', 'Tom', 'Jerry', 'Mickey'];
        for (let i = 0; i < nOrders; i++) {
            await AddCustomer(customerNames[i], (9000000000 + i).toString()); 
            await page.waitForTimeout(100);
            
            const numberOfItems = 5 
            const indxedList = [1,1,2,3,4];
            for (let j = 0; j < numberOfItems; j++) {
                totalIncome += await addItemsToOrder(indxedList[j]);
                totalItems++;
                await page.waitForTimeout(100);
            }
            await addToOrder();
            await page.waitForTimeout(100);
        }

        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(nOrders);
    }, 20000);


    test('2. Complete all orders', async () => {

        const completeOrderBtns = await page.$$('button[data-test-id="complete-order-btn"]');
        for (let i = 0; i < completeOrderBtns.length; i++) {
            await completeOrderBtns[i].click({clickCount: 2, delay: 100});
            await page.waitForTimeout(100);
        }

        const cards = await page.$$('div[data-test-id="order-card"]');
        const completedCards = await page.$$('li[data-test-id="completed-order-card"]');
        expect(completedCards.length).toBe(nOrders);
        expect(cards.length).toBe(0);

    });

    test('3. Check total income', async () => {
        const totalIncomeElement = await page.waitForSelector('[data-test-id="total-completed-orders"]');
        const totalIncomeText = await totalIncomeElement.evaluate(el => el.innerText);
        const total = parseFloat(totalIncomeText.replace('Total: $', ''));
        expect(total).toBe(totalIncome);
    });

    test('4. Check dashboard info matches testing', async () => {
        await NavigateTo(page, '#Dashboard');
        
        // Get dashboard info
        // income up to date info
        const incomeUpToDate = await page.waitForSelector('[data-test-id="income-up-to-date"]');
        const incomeUpToDateText = await incomeUpToDate.$('[data-test-id="card-info-value"]');
        const incomeUpToDateValue = parseCurrency(await incomeUpToDateText.evaluate(el => (el.innerText)));

        // revenue today info
        const revenue = await page.$('[data-test-id="revenue-today"]');
        const revenueText = await revenue.$('[data-test-id="card-info-value"]');
        const revenueValue = parseCurrency(await revenueText.evaluate(el => (el.innerText)));

        // total items sold info
        const totalItemsSold = await page.$('[data-test-id="total-items-sold-today"]');
        const totalItemsSoldText = await totalItemsSold.$('[data-test-id="card-info-value"]');
        const totalItemsSoldValue = await totalItemsSoldText.evaluate(el => parseInt(el.innerText));
        // Total customers info

        const totalCustomers = await page.$('[data-test-id="total-customers"]');
        const totalCustomersText = await totalCustomers.$('[data-test-id="card-info-value"]');
        const totalCustomersValue = await totalCustomersText.evaluate(el => parseInt(el.innerText));

        expect(totalCustomersValue).toBe(nOrders);
        expect(revenueValue).toBe(totalIncome);
        expect(incomeUpToDateValue).toBe(totalIncome);
        expect(totalItemsSoldValue).toBe(totalItems); 
    },30_000);
});


