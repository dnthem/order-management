const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  // Whether to run browser in headless mode.
  launch: {
    headless: import.meta.env.VITE_CI
  },

};