import puppeteer from "puppeteer";
import { pageUrl, databaseName, version, store, NUMBEROFSTORES, parseCurrency } from "../config";
import sampleData from "../../indexedDB/sampleData";
// Delay function
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}


describe('Order - Dashboard', () => {

    let browser;
    let page;
    let totalIncome = sampleData.OrdersV2.reduce((total, order) => total + order.total, 0);
    const totalOrders = sampleData.OrdersV2.length;
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
                indexedDB.deleteDatabase('ORDER_MANAGEMENT');
        });
        
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    });

    afterAll(() => browser.close());

    async function NavigateTo(tag) {
        page.$eval(tag, el => el.click());
        const sidebar = await page.waitForSelector('#sidebarToggle');
        await sidebar.click();
    }

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

        for (let i = 0; i < 10; i++) {
            await AddCustomer(`Test${i}`, (9000000000 + i).toString()); 
            await page.waitForTimeout(200);
            
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
        expect(cards.length).toBe(10 + totalOrders);
    }, 20000);


    test('2. Complete all orders', async () => {

        const completeOrderBtns = await page.$$('button[data-test-id="complete-order-btn"]');
        for (let i = 0; i < completeOrderBtns.length; i++) {
            await completeOrderBtns[i].click({clickCount: 2, delay: 100});
            await page.waitForTimeout(100);
        }

        const cards = await page.$$('div[data-test-id="order-card"]');
        const completedCards = await page.$$('li[data-test-id="completed-order-card"]');
        expect(completedCards.length).toBe(10 + totalOrders);
        expect(cards.length).toBe(0);

    });

    test('3. Check total income', async () => {
        await page.waitForTimeout(1000);
        const totalIncomeElement = await page.$('[data-test-id="total-completed-orders"]');
        const totalIncomeText = await totalIncomeElement.evaluate(el => el.innerText);
        const total = parseFloat(totalIncomeText.replace('Total: $', ''));
        expect(total).toBe(totalIncome);
    });

    test('5. Check dashboard info matches testing', async () => {
        await NavigateTo('#Dashboard');
        await page.waitForTimeout(200);
        
        // Get dashboard info
        // income up to date info
        const incomeUpToDate = await page.$('[data-test-id="income-up-to-date"]');
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


        expect(totalCustomersValue).toBe(10 + sampleData.Customers.length);
        expect(revenueValue).toBe(totalIncome);
        expect(incomeUpToDateValue).toBe(sampleData.IncomeUpToDate[0].Total + totalIncome);

        // Total items sold should be greater than total items because we added 10 orders with 5 items each
        // and there exists some orders in the sample data
        expect(totalItemsSoldValue).toBeGreaterThan(totalItems); 
    },5000);
});


