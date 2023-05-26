const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  // Whether to run browser in headless mode.
  launch: {
    headless: import.meta.env.VITE_CI,
    slowMo: import.meta.env.VITE_CI ? 100 : 0,
    devtools: !import.meta.env.VITE_CI,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--single-process',
      '--disable-gpu',
    ],
  },
};