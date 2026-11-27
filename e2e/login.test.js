const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// frontend dev server আগে থেকে চালু থাকতে হবে (npm run dev)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

jest.setTimeout(30000);

let driver;

beforeAll(async () => {
  const options = new chrome.Options();
  // HEADLESS=true দিলে browser window খোলে না (CI-র জন্য)
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
  }
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('Login page', () => {
  test('login page "Welcome Back" heading দেখায়', async () => {
    await driver.get(`${BASE_URL}/login`);

    const heading = await driver.wait(
      until.elementLocated(By.xpath("//h1[normalize-space()='Welcome Back']")),
      10000
    );

    expect(await heading.isDisplayed()).toBe(true);
  });

  test('খালি form submit করলে error message আসে', async () => {
    await driver.get(`${BASE_URL}/login`);

    const submitButton = await driver.wait(
      until.elementLocated(By.css("button[type='submit']")),
      10000
    );
    // card-এর entry animation শেষ হওয়ার জন্য একটু অপেক্ষা
    await driver.sleep(1000);
    await submitButton.click();

    const error = await driver.wait(
      until.elementLocated(
        By.xpath("//p[contains(., 'Please enter both email and password')]")
      ),
      5000
    );

    expect(await error.isDisplayed()).toBe(true);
  });
});
