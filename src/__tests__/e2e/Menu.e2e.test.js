import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import puppeteer from "puppeteer";
import { pageUrl, databaseName, launchOptions, NUMBEROFSTORES } from "../config";
import sampleData from "../../indexedDB/sampleData";
import { preview } from 'vite';
// Delay function
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

console.log(launchOptions);

describe("Menu", () => {
  let server;
  let browser;
  let page;
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

  async function NavigateToMenu() {
    page.$eval('#Menu', el => el.click());
    const sidebar = await page.waitForSelector('#sidebarToggle');
    await sidebar.click();
  }

  test('1. Add an item to menu', async () => {

      // Navigate to menu
      await NavigateToMenu();
      await page.waitForSelector('div[data-test-id="menu-item-card"]');
      const before = await page.$$('div[data-test-id="menu-item-card"]');
      expect(before.length).toBe(sampleData['Menu'].length);


      // Add item to menu
      const btn = await page.waitForSelector('button[data-test-id="add-new-item"]');
      await btn.click();

      await (await page.waitForSelector('button[data-test-id="new-card-edit"]')).click();
      await (await page.waitForSelector('input[data-test-id="new-card-item-name"]')).type('Test');
      await (await page.waitForSelector('input[data-test-id="new-card-item-price"]')).type('10');
      await (await page.waitForSelector('button[data-test-id="new-item-save"]')).click();
      
      const after = await page.$$('div[data-test-id="menu-item-card"]');
      expect(after.length).toBe(before.length + 1);

  });

  test('2. Edit an item in menu', async () => {
    const before = await page.$$('div[data-test-id="menu-item-card"]');

    // Randomly select an item to edit
    const randomItem = Math.floor(Math.random() * before.length);
    const item = before[randomItem];
    const cardBody = await item.waitForSelector('div.card-body');
    const editBtn = await cardBody.waitForSelector('button[data-test-id="edit"]');
    await editBtn.click();
    await page.waitForTimeout(200);
    const inputText = await cardBody.waitForSelector('input[data-test-id="item-name"]');
    await inputText.type('Edited');
    const inputPrice = await cardBody.waitForSelector('input[data-test-id="item-price"]');

    await inputPrice.type('0');
    const saveBtn = await cardBody.waitForSelector('button[data-test-id="save"]');
    await saveBtn.click();
    await page.waitForTimeout(200);
    // Check if item is edited
    const after = await page.$$('div[data-test-id="menu-item-card"]');
    const editedItem = after[randomItem];
    const editedCardBody = await editedItem.waitForSelector('div.card-body');
    const editedItemName = await editedCardBody.waitForSelector('span[data-test-id="item-name"]');
    const editedItemPrice = await editedCardBody.waitForSelector('input[data-test-id="item-price"]');

    expect(await editedItemName.evaluate(el => el.innerText)).toBe('Edited');
    expect(await editedItemPrice.evaluate(el => el.value)).toBe('0');
  });

  test('3. Delete an item in menu', async () => {
    // disable confirm dialog, set it to always true
    await page.evaluate(() => {
      window.confirm = () => true;
    });

    
    // randomly select an item to delete
    const before = await page.$$('div[data-test-id="menu-item-card"]');
    const randomItem = Math.floor(Math.random() * before.length);
    const item = before[randomItem];
    const cardBody = await item.waitForSelector('div.card-body');
    const deleteBtn = await cardBody.waitForSelector('button[data-test-id="remove"]');
    await deleteBtn.click();

    // confirm delete
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await delay(100);

    // check if item is deleted
    const after = await page.$$('div[data-test-id="menu-item-card"]');
    expect(after.length).toBe(before.length - 1);

  });


  test('4. Hide an item in menu', async () => {
    // randomly select an item to hide
    const cards = await page.$$('div[data-test-id="menu-item-card"]');
    const randomItem = Math.floor(Math.random() * cards.length);
    const item = cards[randomItem];
    const cardBody = await item.waitForSelector('div.card-body');
    const hideBtn = await cardBody.waitForSelector('input[data-test-id="hide"]');
    await hideBtn.click();

    // check if item is hidden by checking item css 
    const css = await item.evaluate(el => {
      return {
        opacity: el.style.opacity,
      }
    });

    expect(css.opacity).toBe('0.5');
  });

  test('5. Delete all items in menu', async () => {

    await page.evaluate(() => {
      window.confirm = () => true;
    });
    await page.waitForSelector('div[data-test-id="menu-item-card"]');
    const cards = await page.$$('div[data-test-id="menu-item-card"]');
    for (const card of cards) {
      const cardBody = await card.waitForSelector('div.card-body');
      const deleteBtn = await cardBody.waitForSelector('button[data-test-id="remove"]');
      await deleteBtn.click();
      
    }
    await delay(100);
    const after = await page.$$('div[data-test-id="menu-item-card"]');
    expect(after.length).toBe(0);
  });

  test('6. Add multiple items to menu', async () => {

    const addBtn = await page.waitForSelector('button[data-test-id="add-new-item"]');

    for (let i = 0; i < 10; i++) {
      await addBtn.click();
      await (await page.waitForSelector('button[data-test-id="new-card-edit"]')).click();
      await (await page.waitForSelector('input[data-test-id="new-card-item-name"]')).type('Test' + i);
      await (await page.waitForSelector('input[data-test-id="new-card-item-price"]')).type('10');
      await (await page.waitForSelector('button[data-test-id="new-item-save"]')).click();
    }

    const after = await page.$$('div[data-test-id="menu-item-card"]');
    expect(after.length).toBe(10);
  });


  test('7. hide all items in menu', async () => {
    await page.waitForSelector('div[data-test-id="menu-item-card"]');
    const cards = await page.$$('div[data-test-id="menu-item-card"]');

    let countHidden = 0;
    for (const card of cards) {
      countHidden++;
      const cardBody = await card.$('div.card-body');
      const hideBtn = await cardBody.$('input[data-test-id="hide"]');
      await hideBtn.click();

      const css = await card.evaluate(el => {
        return {
          opacity: el.style.opacity,
        }
      }
      );
      expect(css.opacity).toBe('0.5');
    }

    expect(countHidden).toBe(cards.length);
  });

  test('8. show all items in menu', async () => {
    await page.waitForSelector('div[data-test-id="menu-item-card"]');
    const cards = await page.$$('div[data-test-id="menu-item-card"]');
    let countShown = 0;
    for (const card of cards) {
      countShown++;
      const cardBody = await card.$('div.card-body');
      const showBtn = await cardBody.$('input[data-test-id="hide"]');
      await showBtn.click();

      const css = await card.evaluate(el => {
        return {
          opacity: el.style.opacity,
        }
      }
      );
      expect(css.opacity).toBe('');
    }

    expect(countShown).toBe(cards.length);
  });


  test('9. Randomly hide an item in menu', async () => {
    await page.waitForSelector('div[data-test-id="menu-item-card"]');
    const before = await page.$$('div[data-test-id="menu-item-card"]');
    const randomItem = Math.floor(Math.random() * before.length);
    const item = before[randomItem];
    const cardBody = await item.$('div.card-body');
    const hideBtn = await cardBody.$('input[data-test-id="hide"]');
    await hideBtn.click();

    const after = await page.$$('div[data-test-id="menu-item-card"]');
    let countHidden = 0;
    for (const card of after) {
      const css = await card.evaluate(el => {
        return {
          opacity: el.style.opacity,
        }}
      );
      if (css.opacity === '0.5') {
        countHidden++;
      }
    }

    expect(countHidden).toBe(1);
  });
});
  