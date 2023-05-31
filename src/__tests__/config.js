export const databaseName = "ORDER_MANAGEMENT";
export const version = 1;
export const pageUrl = "https://localhost:3000/";
export const store = "Menu";
export const NUMBEROFSTORES = 6;

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======

>>>>>>> 07d341362b119b45830011e350542baa4101b929
export const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g,""));
}

export  async function NavigateTo(page, tag) {
    page.$eval(tag, el => el.click());
    const sidebar = await page.waitForSelector('#sidebarToggle');
    await sidebar.click();
}

<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 07d341362b119b45830011e350542baa4101b929
test("Test config", () => {
    expect(true).toBe(true);
});