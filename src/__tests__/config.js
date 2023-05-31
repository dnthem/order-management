export const databaseName = "ORDER_MANAGEMENT";
export const version = 1;
export const pageUrl = import.meta.env.VITE_PREVIEW_URL || "https://localhost:3000/";
export const store = "Menu";
export const NUMBEROFSTORES = 6;

export const launchOptions = {
    executablePath: import.meta.env.VITE_CHROME_PATH || null,
    headless: import.meta.env.VITE_HEADLESS === "new" ? 'new' : false,
    devtools: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    env: {
        DISPLAY: import.meta.env.VITE_DISPLAY || null,
    }
};

export const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g,""));
}

export  async function NavigateTo(page, tag) {
    page.$eval(tag, el => el.click());
    const sidebar = await page.waitForSelector('#sidebarToggle');
    await sidebar.click();
}