import puppeteer from "puppeteer";
import { pageUrl, parseCurrency, NavigateTo } from "../config";
import sampleData from "../../indexedDB/sampleData";



describe('Order Dashboard suite 2', () => {
    let browser;
    let page;
    let totalIncome = 0;
    let totalItems = 0;
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            defaultViewport: null
        }); // error if not headless : 'old not used :
        
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
        
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    });

    afterAll(() => browser.close());

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


    // Remove All orders
    test('1. Remove all orders', async () => {
        // navigate to orders
        await NavigateTo(page, '#Orders');
        await page.waitForTimeout(200);

        // Remove all orders
        const deleteBtns = await page.$$('button[data-test-id="delete-order-btn"]');
        for (let i = 0; i < deleteBtns.length; i++) {
            await deleteBtns[i].click({clickCount: 2, delay: 100});
            await page.waitForTimeout(100);
        }

        // Check if all orders are removed
        const cards = await page.$$('div[data-test-id="order-card"]');

        expect(cards.length).toBe(0);
    }, 10000);

    // Add 10 orders with 5 items each
    test('2. Add 10 orders with 5 items each', async () => {
        // wait 100ms
        await page.waitForTimeout(100);
        // Add 10 orders with 5 items each
        for (let i = 0; i < 10; i++) {
            await AddCustomer(`Customer`, `012345678${i}`);
            await page.waitForTimeout(200);
            for (let j = 0; j < 5; j++) {
                totalIncome += await addItemsToOrder(j);
                await page.waitForTimeout(100);
            }
            await addToOrder();
            await page.waitForTimeout(100);
        }

        // Check if all orders are added
        const cards = await page.$$('div[data-test-id="order-card"]');

        expect(cards.length).toBe(10);
    }, 15000);

    // Complete all orders

    test('3. Complete all orders', async () => {
        // wait 100ms
        await page.waitForTimeout(100);
        // Complete all orders
        const completeBtns = await page.$$('button[data-test-id="complete-order-btn"]');
        const length = completeBtns.length;
        for (let i = 0; i < length; i++) {
            const newBtn = await page.$('button[data-test-id="complete-order-btn"]');
            await newBtn.click({clickCount: 2, delay: 100});
            await page.waitForTimeout(100);
        }
        await page.waitForTimeout(100);
        // Check if all orders are completed
        const cards = await page.$$('li[data-test-id="completed-order-card"]');

        expect(cards.length).toBe(10);
    }, 20000);

    // navigate to dashboard and check if the data is correct
    test('4. Check revenue today', async () => {
        // navigate to dashboard
        await NavigateTo(page, '#Dashboard');
        await page.waitForTimeout(100);

        // get revenue today
        const revenueTodayCard = await page.$('div[data-test-id="revenue-today"]');
        const revenueToday = await revenueTodayCard.$('div[data-test-id="card-info-value"]');
        const revenueTodayText = await revenueToday.evaluate(revenueToday => revenueToday.innerText);
        const revenueValue = parseCurrency(revenueTodayText);
        expect(totalIncome).toBe(revenueValue);
    }, 6000);
    
    // check total items sold today to match total items
    test('5.  Check total items sold today to match total items', async () => {
        // wait 100ms
        await page.waitForTimeout(100);
        // get total items sold today
        const totalItemsSoldCard = await page.$('div[data-test-id="total-items-sold"]');
        const totalItemsSold = await totalItemsSoldCard.$('div[data-test-id="card-info-value"]');
        const totalItemsSoldText = await totalItemsSold.evaluate(totalItemsSold => totalItemsSold.innerText);
        const totalItemsSoldValue = parseInt(totalItemsSoldText);

        const totalItemsSoldTodayCard = await page.$('div[data-test-id="total-items-sold-today"]');
        const totalItemsSoldToday = await totalItemsSoldTodayCard.$('div[data-test-id="card-info-value"]');
        const totalItemsSoldTodayText = await totalItemsSoldToday.evaluate(totalItemsSoldToday => totalItemsSoldToday.innerText);
        const totalItemsSoldTodayValue = parseInt(totalItemsSoldTodayText);

        expect(totalItemsSoldValue).toBe(totalItemsSoldTodayValue);
    });
});