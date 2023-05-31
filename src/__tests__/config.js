export const databaseName = "ORDER_MANAGEMENT";
export const version = 1;
export const pageUrl = "https://localhost:3000/";
export const store = "Menu";
export const NUMBEROFSTORES = 6;

<<<<<<< Updated upstream
=======
export const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g,""));
}

export  async function NavigateTo(page, tag) {
    page.$eval(tag, el => el.click());
    const sidebar = await page.waitForSelector('#sidebarToggle');
    await sidebar.click();
}

>>>>>>> Stashed changes
test("Test config", () => {
    expect(true).toBe(true);
});