import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import puppeteer from "puppeteer";
import { pageUrl, databaseName, launchOptions, NUMBEROFSTORES, NavigateTo, delay } from "../config";
import sampleData from "../../indexedDB/sampleData";
import { preview } from 'vite';

describe("Customer suggestion list", () => {
    let server;
    let browser;
    let page;
    beforeAll(async () => {
      server = await preview({ preview : { port : 3000 }});
      browser = await puppeteer.launch(launchOptions); // error if not headless : 'old not used : https://github.com/ckeditor/ckeditor5/issues/14063
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

    async function CancelAddOrder() {
        await page.waitForSelector('button[data-test-id="add-to-order-form-cancel-btn"]');
        const cancelBtn = await page.$('button[data-test-id="add-to-order-form-cancel-btn"]');
        await cancelBtn.click();
    }

    test("1. should add new customers", async () => {
        await NavigateTo(page, '#Orders');
        // add all customer from sample data
        for (let i = 0; i < sampleData.Customers.length; i++) {
            await AddCustomer(sampleData.Customers[i].customerName, sampleData.Customers[i].phone);
            await CancelAddOrder();
        }

        await NavigateTo(page, '#Dashboard');
        await page.evaluate(() => {
            const el = document.querySelector('table');
            el.scrollIntoView();
        })
        await page.waitForSelector('tr[data-test-id="customer-info"]');
        const customerInfo = await page.$$('tr[data-test-id="customer-info"]');

        expect(customerInfo.length).toBe(sampleData.Customers.length);
    }, 30_000);

    test("2. should suggest customer name: John Doe", async () => {
        if (import.meta.env.VITE_SKIP_TESTS === 'true') {
            expect(import.meta.env.VITE_SKIP_TESTS).toBe('true');
            return;
        };

        await NavigateTo(page, '#Orders');

        const btnAddOrder = await page.waitForSelector('button[data-test-id="add-new-order-btn"]');
        await btnAddOrder.click();
        const addCustomerForm = await page.waitForSelector('div[data-test-id="add-customer-form"]');

        const customerNameInput = await addCustomerForm.$('input[data-test-id="customer-name-input"]');
        await customerNameInput.type('John Doe');
        await delay(1000);
        await page.waitForSelector('ul', { timeout: 1000, visible: false });
        const suggestionNames = await page.evaluate(() => {
            const suggestionNameElement = document.querySelectorAll('li');
            return Array.from(suggestionNameElement).map((el) => el.innerText.toLowerCase());
        });
        const found = suggestionNames.findIndex(e => e.includes('John Doe'.toLowerCase()));
        expect(found).not.toBe(-1);

    }, 20_000);
});