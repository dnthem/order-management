import puppeteer from "puppeteer";
import { beforeAll, afterAll, describe, test, expect } from "vitest";
import {
  parseCurrency,
  launchOptions,
  delay,
} from "../../../__tests__/config";
import { dateFormat, phoneFormat } from "../../../utils";
import { preview } from "vite";
describe("Orders Page - test 2: Check for correction when creating an order", () => {
  let server;
  let browser;
  let page;

  // random port
  const port = Math.floor(Math.random() * 1000) + 3000;
  const pageUrl = `http://localhost:${port}/orders`;

  beforeAll(async () => {
    server = await preview({ preview: { port } });
    browser = await puppeteer.launch(launchOptions);

    page = await browser.newPage();

    // Clear indexedDB
    await page.goto("chrome://indexeddb-internals");
    await page.evaluate(() => {
      try {
        indexedDB.deleteDatabase("ORDER_MANAGEMENT");
      } catch (e) {
        console.log(e);
      }
    });
    page.close();
    page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
  });

  afterAll(() => {
    browser.close();
    server.httpServer.close();
  });
  /**
   * Tag list for tests
   *
   * order card: div[data-test-id="order-card"]
   * card title: h5[aria-label="card-title"]
   * customer phone number on card: divdd[aria-label="customer-phone-number"]
   * customer total and payment type on card: div[aria-label="total-payment-type"]
   * customer order date: div[aria-label="order-date"]
   * customer deliver date: div[aria-label="deliver-date"]
   * customer order notes: p[aria-label="order-notes"]
   * edit button: button[data-test-id="edit-order-btn"]
   * complete button: button[data-test-id="complete-order-btn"]
   *
   * customer form:
   * form phone: input[data-test-id="phone"]
   * form  name: input[data-test-id="customer-name"]
   * form order date: input[data-test-id="order-date"]
   * form deliver date: input[data-test-id="deliver-date"]
   * form notes: textarea[data-test-id="notes"]
   * form payment type: select[data-test-id="payment-type"]
   * form submit: button[data-test-id="add-to-order-form-btn"]
   * form cancel: button[data-test-id="add-to-order-form-cancel-btn"]
   *
   * add btn: button[data-test-id="add-new-order-btn"]
   * form add customer
   * form customer name: input[data-test-id="customer-name-input"]
   * form customer phone: input[data-test-id="phone-input"]
   * form confirm: button[data-test-id="confirm-btn"]
   *
   * menu selection:
   * add item btn: button[data-test-id="add-to-order-btn"]
   * item pprice : input[]
   *  */

  // test add a new customer, then add a few items to the order, then confirm the order

  const customerInfo = {
    name: "TestMe",
    phone: "9132154632",
  };
  const orderInfo = {
    orderDate: dateFormat(new Date()),
    deliverDate: dateFormat(new Date()),
    notes: "test notes",
    paymentType: "Cash",
    promotion: "20",
    total: 0,
    cart: [],
  };
  const itemList = [0,1,2,3, 4,4,4];
  const itemCount = [1,1,1,1,3];
  test("1. Add a new customer, then add a few items to the order, then confirm the order", async () => {
    // add new order
    const btnAddOrder = await page.waitForSelector(
      'button[data-test-id="add-new-order-btn"]'
    );
    await btnAddOrder.click();

    // add customer name
    const addCustomerForm = await page.waitForSelector(
      'div[data-test-id="add-customer-form"]'
    );
    const customerNameInput = await addCustomerForm.waitForSelector(
      'input[data-test-id="customer-name-input"]'
    );
    await customerNameInput.type(customerInfo.name);

    // add customer phone
    const customerPhoneInput = await addCustomerForm.waitForSelector(
      'input[data-test-id="phone-input"]'
    );
    await customerPhoneInput.type(customerInfo.phone);

    // confirm customer

    const confirmBtn = await addCustomerForm.waitForSelector(
      'button[data-test-id="confirm-btn"]'
    );
    await confirmBtn.click();

    // add items to order
    await page.waitForSelector('tr[data-test-id="menu-table-card"]');
    const menuItems = await page.$$('tr[data-test-id="menu-table-card"]');
    // select an item and add 4 times
    
    for (let i = 0; i < 4; i++) {
      const addToOrderBtn = await menuItems[itemList[i]].waitForSelector(
        '[data-test-id="add-to-order-btn"]'
      );
      const itemPrice = await menuItems[itemList[i]].waitForSelector(
        '[data-test-id="menu-table-card-price"]'
      );
      const priceText = await itemPrice.evaluate((el) => el.innerText);
      const price = parseCurrency(priceText);
      orderInfo.total += price;
      
      const itemName = await menuItems[itemList[i]].waitForSelector(
        '[data-test-id="menu-table-card-name"]'
      );
      const nameText = await itemName.evaluate((el) => el.innerText);

      orderInfo.cart.push(nameText);

      await addToOrderBtn.click();
      await delay(100);
    }

    // Clear promotion input and add promotion
    const promotionInput = await page.waitForSelector(
      'input[data-test-id="promotion-input"]'
    );
    await promotionInput.evaluate((el) => (el.value = ""));
    await promotionInput.type(orderInfo.promotion.toString());

    // add notes
    const notesInput = await page.waitForSelector(
      'textarea[data-test-id="notes"]'
    );
    await notesInput.type(orderInfo.notes);

    // confirm order
    const confirmAddToOrderBtn = await page.waitForSelector(
      'button[data-test-id="add-to-order-form-btn"]'
    );
    await confirmAddToOrderBtn.click();
    await delay(100);

    // check if the order is added
    const cards = await page.$$('div[data-test-id="order-card"]');
    expect(cards.length).toBe(1);
  });
  // test 2, confirm the information is correct
  test("2. Confirm name is correct", async () => {
    // check customer name
    const cardTitle = await page.$('h5[aria-label="card-title"]');
    const customerName = await cardTitle.evaluate((el) => el.innerText);
    const expectedCustomerName = `1 - ${customerInfo.name}`;
    expect(customerName).toBe(expectedCustomerName);
  });

  test("3. Confirm phone is correct", async () => {
    // check customer phone
    const customerPhoneNumber = await page.$(
      'div[aria-label="customer-phone-number"]'
    );
    const customerPhone = await customerPhoneNumber.evaluate(
      (el) => el.innerText
    );
    expect(customerPhone).toBe(phoneFormat(customerInfo.phone));
  });

  test("4. Confirm total and payment type is correct", async () => {
    // check total and payment type
    const totalAndPaymentType = await page.$(
      'div[aria-label="total-payment-type"]'
    );
    const totalAndPaymentTypeText = await totalAndPaymentType.evaluate(
      (el) => el.innerText
    );
    const expectedTotalAndPaymentType = `$${
      orderInfo.total - orderInfo.promotion
    } - ${orderInfo.paymentType}`;
    expect(totalAndPaymentTypeText).toBe(expectedTotalAndPaymentType);
  });

  test("5. Confirm order date is correct", async () => {
    // check order date
    const orderDate = await page.$('div[aria-label="order-date"]');
    const orderDateText = await orderDate.evaluate((el) => el.innerText);
    expect(orderDateText).toContain(orderInfo.orderDate);
  });

  test("6. Confirm deliver date is correct", async () => {
    // check deliver date
    const deliverDate = await page.$('div[aria-label="deliver-date"]');
    const deliverDateText = await deliverDate.evaluate((el) => el.innerText);
    expect(deliverDateText).toContain(orderInfo.deliverDate);
  });

  test("7. Confirm notes is correct", async () => {
    // check notes
    const summary = await page.$("summary");
    await summary.click();
    await delay(200);
    const orderNotes = await page.waitForSelector('[aria-label="order-notes"]');
    const orderNotesText = await orderNotes.evaluate((el) => el.innerText);
    expect(orderNotesText).toContain(orderInfo.notes);
  });

  test("8. Confirm cart is showing correct 3 items", async () => {
    // check cart
    const cart = await page.$$('ul[data-test-id="order-cart-list"] > li');
    expect(cart.length).toBe(4);
  });

  test("9. Confirm cart is showing correct 4 items when is clicked on", async () => {
    // check cart
    const cart = await page.$('ul[data-test-id="order-cart-list"]');
    await cart.click();
    await delay(200);
    const cartItems = await page.$$('ul[data-test-id="order-cart-list"] > li');
    expect(cartItems.length).toBe(orderInfo.cart.length + 1);
  });

  // confirm items in cart have correct name
  test("10. Confirm cart items have correct name", async () => {
    // check cart
    const cartItems = await page.$$('ul[data-test-id="order-cart-list"] > li');
    for (let i = 0; i < cartItems.length - 1; i++) {
      const cartItemName = await cartItems[i].evaluate((el) => el.innerText);
      expect(cartItemName).toBe(`${itemCount[i]} x ${orderInfo.cart[i]}`);
    }
  });
});
