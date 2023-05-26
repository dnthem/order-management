import puppeteer from "puppeteer";
import { pageUrl, databaseName, version, store, NUMBEROFSTORES } from "../config";
import sampleData from "../../indexedDB/sampleData";
// Delay function
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

describe('Orders - basic checks', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            devtools: false,
            defaultViewport: null
        }); // error if not headless : 'old not used :
        
        page = await browser.newPage();
        
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    });

    afterAll(() => browser.close());

    async function NavigateToOrders() {
        page.$eval('#Orders', el => el.click());
        const sidebar = await page.waitForSelector('#sidebarToggle');
        await sidebar.click();
      }

    test('1. Check number of orders', async () => {
        NavigateToOrders();
        
        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(0);
    });

    test('2. Check add customer form dialog', async () => {
        await page.waitForTimeout(100);
        const btnAddOrder = await page.waitForSelector('button[data-test-id="add-new-order-btn"]');
        await btnAddOrder.click();

        const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');
        expect(addCustomerForm).not.toBeNull();
    });


    test('3. Test add customer form -> add to order form shows up', async () => {

        const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');

        const customerNameInput = await addCustomerForm.$('input[data-test-id="customer-name-input"]');
        await customerNameInput.type('Test');
        const customerPhoneInput = await addCustomerForm.$('input[data-test-id="phone-input"]');
        await customerPhoneInput.type('1234567890');
        const confirmBtn = await addCustomerForm.$('button[data-test-id="confirm-btn"]');
        await confirmBtn.click();

        const addToOrderForm = await page.waitForSelector('div[data-test-id="add-to-order-form"]');
        expect(addToOrderForm).not.toBeNull();
    });

    test('4. Check if the number of menu items are correct', async () => {
        
        const menuItems = await page.$$('tr[data-test-id="menu-table-card"]');
        expect(menuItems.length).toBe(sampleData['Menu'].length);
    });

    test('5. Add 4 items to cart and check for correct prices', async () => {      
        const menuItems = await page.$$('tr[data-test-id="menu-table-card"]');
        let counter = 0;
        let totalPrice = 0;

        for (let i = 0; i < 4; i++) {
            const addToOrderBtn = await menuItems[i].$('td > button[data-test-id="add-to-order-btn"]');
            await addToOrderBtn.click();
            counter++;
            totalPrice += await menuItems[i].$eval('td[data-test-id="menu-table-card-price"]', el => parseFloat(el.innerText.slice(1)));
  
            if (counter === 4)
                break;
        }
        
        const addToOrderForm = await page.$('div[data-test-id="add-to-order-form"]');
        const total = await addToOrderForm.$eval('span[data-test-id="order-total"]', el => parseFloat(el.innerText.slice(1)));
        const orderItems = await page.$$('li[data-test-id="customer-cart-card"]');
        expect(orderItems.length).toBe(4);
        expect(total).toBe(totalPrice);
        
    });

    test('6. Confirm order -> close add-to-order form', async () => {
        const addToOrderForm = await page.$('div[data-test-id="add-to-order-form"]');
        const confirmBtn = await addToOrderForm.$('button[data-test-id="add-to-order-form-btn"]');
        await confirmBtn.click();

        const addToOrderFormClosed = await page.$('div[data-test-id="add-to-order-form"]');
        expect(addToOrderFormClosed).toBeNull();
    });

    test('7. Check if the number of orders is correct to be 1', async () => {

        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(1);
    });

    test('8. Add 3 more orders and expect to have 4 orders', async () => {

        const btnAddOrder = await page.waitForSelector('button[data-test-id="add-new-order-btn"]');

        for (let i = 0; i < 3; i++) {
            // add new order
            await btnAddOrder.click();

            // add customer name
            const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');
            const customerNameInput = await addCustomerForm.$('input[data-test-id="customer-name-input"]');
            await customerNameInput.type('test' + i*2);

            // add customer phone
            const customerPhoneInput = await addCustomerForm.$('input[data-test-id="phone-input"]');
            const randomPhone = Math.floor(Math.random() * 1000000000);
            await customerPhoneInput.type(randomPhone.toString());

            // confirm customer
            const confirmBtn = await addCustomerForm.$('button[data-test-id="confirm-btn"]');
            await confirmBtn.click();

            // add items to order
            const menuItems = await page.$$('tr[data-test-id="menu-table-card"]');
            // select random 4 items
            for (let j = 0; j < 4; j++) {
                const randomItemIndex = Math.floor(Math.random() * menuItems.length);
                const addToOrderBtn = await menuItems[randomItemIndex].$('td > button[data-test-id="add-to-order-btn"]');
                await addToOrderBtn.click();
            }

            // confirm order
            const addToOrderForm = await page.$('div[data-test-id="add-to-order-form"]');
            const confirmAddToOrderBtn = await addToOrderForm.$('button[data-test-id="add-to-order-form-btn"]');
            await confirmAddToOrderBtn.click();
            await page.waitForTimeout(1000);
        }

        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(4);
    },5000);

    test('9. Remove 2 orders and expect to have 2 orders', async () => {

        const deleteOrderBtns = await page.$$('button[data-test-id="delete-order-btn"]');
        for (let i = 0; i < 2; i++) {
            await deleteOrderBtns[i].click({clickCount: 2, delay: 100});
        }

        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(2);
    });

    test('10. Complete 1 order and expect to have 1 order', async () => {

        const completeOrderBtns = await page.$$('button[data-test-id="complete-order-btn"]');
        await completeOrderBtns[0].click({clickCount: 2, delay: 100});

        const cards = await page.$$('div[data-test-id="order-card"]');
        expect(cards.length).toBe(1);
    });

    test('11. Check if the number of completed orders is correct to be 1', async () => {

        const completedOrders = await page.$$('li[data-test-id="completed-order-card"]');
        expect(completedOrders.length).toBe(1);
    });

    test('12. Edit order and expect to at most 2 items in the order', async () => {
        // edit order
        const editOrderBtn = await page.waitForSelector('button[data-test-id="edit-order-btn"]');
        await editOrderBtn.click();

        // remove all items except 2
        const addToOrderForm = await page.waitForSelector('div[data-test-id="add-to-order-form"]');
        const cartItems = await addToOrderForm.$$('li[data-test-id="customer-cart-card"]');
        for(let i = cartItems.length-1; i > 1; i--) {
            const removeBtn = await cartItems[i].$('button[data-test-id="remove-item-from-cart-btn"]');
            await removeBtn.click();
            await page.waitForTimeout(100);
        }
        // confirm order
        const confirmBtn = await addToOrderForm.$('button[data-test-id="add-to-order-form-btn"]');
        await confirmBtn.click();

        const orderItems = await page.$$('ul[data-test-id="customer-cart-list"]');
        expect(orderItems.length).toBeLessThanOrEqual(2);
    });
});