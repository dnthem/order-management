import puppeteer from "puppeteer";
import { NavigateTo, delay, launchOptions } from "../config";
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { preview } from 'vite';

describe('Check synchronization of the Menu on Menu and Order Pages', () => {
    let server;
    let browser;
    let page;
    const port = 3001;
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
        const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');
        const customerNameInput = await addCustomerForm.waitForSelector('[data-test-id="customer-name-input"]');
        await customerNameInput.type(customerName);
        const customerPhoneInput = await addCustomerForm.waitForSelector('[data-test-id="phone-input"]');
        await customerPhoneInput.type(phone);
        const confirmBtn = await addCustomerForm.waitForSelector('[data-test-id="confirm-btn"]');
        await confirmBtn.click();
    }


    // Test 1
    // Hide some items in menu page
    // Save what Items are hidden
    // Go to order page
    // Check if the hidden items are hidden in order page
    let listItems = []; // list of items to hide
    test("1. Hide some items in menu page", async () => {
        await NavigateTo(page, pageUrl, "Menu");
        await page.waitForSelector('[data-test-id="menu-item-card"]', {timeout: 200});
        const menuItems = await page.$$('[data-test-id="menu-item-card"]');
        
        // Hide some random cards, and store their names in listItems
        const hideList = [0, 4, 2 ];
        for (let i = 0; i < 3; i++) {
            const itemIndex = hideList[i];
            const itemName = await menuItems[itemIndex].$eval('[data-test-id="item-name"]', el => el.innerText);
            listItems.push(itemName);
            const hideBtn = await menuItems[itemIndex].waitForSelector('[data-test-id="hide"]');
            await hideBtn.click();
        }

        // Go to order page
        await NavigateTo(page, pageUrl, "Orders");
        await AddCustomer("test", "1234567890");

        // Check if the hidden items are hidden in order page
        await page.waitForSelector('[data-test-id="menu-table-card"]');
        const menuItemList = await page.$$('tr[data-test-id="menu-table-card"]');
        for (let i = 0; i < listItems.length; i++) {
            const itemName = await menuItemList[i].$eval('td', el => el.innerText);
            const index = listItems.findIndex(item => item === itemName);
            expect(index).toBe(-1);
        }

        const cancleBtn = await page.waitForSelector('[data-test-id="add-to-order-form-cancel-btn"]');
        await cancleBtn.click();
    }, 15000);


    // Test 2
    // Add some items to menu page
    // Save what Items are added
    // Go to order page
    // Check if the added items are added in order page
    
    test("2. Add some items to menu page", async () => {
        listItems = [];
        await NavigateTo(page, pageUrl, "Menu");
        // Add 3 new Items
        const btnAddItem = await page.waitForSelector('[data-test-id="add-new-item"]');

        for (let i = 0; i < 3; i++) {
            await btnAddItem.click();
            const cardBody = await page.waitForSelector('.card-body');
            const editBtn = await cardBody.waitForSelector('[data-test-id="new-card-edit"]');
            await editBtn.click();

            const itemNameInput = await cardBody.waitForSelector('[data-test-id="new-card-item-name"]');
            await itemNameInput.type("test" + i);
            const itemPriceInput = await cardBody.waitForSelector('[data-test-id="new-card-item-price"]');
            await itemPriceInput.type("1");

            listItems.push("test" + i);

            const confirmBtn = await cardBody.waitForSelector('[data-test-id="new-item-save"]');
            await confirmBtn.click();
            await delay(100);
        }
        
        // Go to order page
        await NavigateTo(page, pageUrl, "Orders");
        await AddCustomer("test", "1234567890");

        // Check if the added items are added in order page
        await page.waitForSelector('[data-test-id="menu-table-card"]');
        const menuItemList = await page.$$('tr[data-test-id="menu-table-card"]');
        const trueListItems = [];
        for (let i = 0; i < menuItemList.length; i++) {
            const itemName = await menuItemList[i].$eval('td', el => el.innerText.trim());
            const index = listItems.findIndex(item => item.toLowerCase() === itemName.toLowerCase());
            if (index !== -1) {
                trueListItems.push(listItems[index]);
            }
        }
        const cancleBtn = await page.waitForSelector('[data-test-id="add-to-order-form-cancel-btn"]');
        await cancleBtn.click();

        expect(trueListItems.length).toBe(listItems.length);

    }, 20_000);

    // Test 3
    // Remove some items from menu page
    // Save what Items are removed
    // Go to order page
    // Check if the removed items are removed in order page
    test("3. Remove some items from menu page", async () => {

        listItems = [];
        await NavigateTo(page, pageUrl, "Menu");
        await page.evaluate(() => {
            window.confirm = () => true;
        });

        await page.waitForSelector('[data-test-id="menu-item-card"]');
        // Remove 3 items from menu page, save their name in listItems
        // only select unhidden items
        
        const menuItemsList = await page.$$('[data-test-id="menu-item-card"]');
        for (let i = menuItemsList.length - 1; i >= menuItemsList.length - 3; i--) {
            // check for hidden items
            const item = menuItemsList[i];
            const css = await item.evaluate(el => {
                return {
                  opacity: el.style.opacity,
                }
              });
            if (css.opacity === "0.5")
                continue;

        
            const itemName = await item.$eval('[data-test-id="item-name"]', el => el.innerText.trim());
            listItems.push(itemName);
            const removeBtn = await item.waitForSelector('[data-test-id="remove"]');
            await removeBtn.click();
        }

        // Go to order page
        await NavigateTo(page, pageUrl, "Orders");
        await AddCustomer("test", "1234569890");

        // Check if the removed items are removed in order page
        await page.waitForSelector('[data-test-id="menu-table-card"]');
        const menuItemList = await page.$$('tr[data-test-id="menu-table-card"]');
        let flag = true;
        for (let i = 0; i < menuItemList.length; i++) {
            const itemName = await menuItemList[i].$eval('td', el => el.innerText.trim());
            const index = listItems.findIndex(item => item.toLowerCase() === itemName.toLowerCase());
            if (index !== -1) {
                flag = false;
                break;
            }
        }
        expect(flag).toBe(true);
    }, 15000);

    // Test 4
    // Change some items in menu page
    // Save what Items are changed
    // Go to order page
    // Check if the changed items are changed in order page

    test("4. Change some items in menu page (not impleted yet)", async () => {
        
        expect(true).toBe(true);
    });

});