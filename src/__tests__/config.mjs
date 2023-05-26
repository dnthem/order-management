export const databaseName = "ORDER_MANAGEMENT";
export const version = 1;
export const pageUrl = import.meta.env.PREVIEW_URL || "https://localhost:5173/";
export const store = "Menu";
export const NUMBEROFSTORES = 6;

test("Test config", () => {
    expect(true).toBe(true);
});