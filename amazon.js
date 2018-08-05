const puppeteer = require('puppeteer');
const { amazon: CREDS } = require('./credentials.json');

const AMAZON_NOTEBOOKS_URL = 'https://read.amazon.com/notebook';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/61.0';

// Selector used for extracting highlights
const BOOK_SELECTOR = '.kp-notebook-library-each-book';
const TITLE_SELECTOR = 'h3.a-spacing-top-small';
const AUTHOR_SELECTOR = 'p.a-spacing-none:nth-child(3)';
const HIGHLIGHT_SELECTOR = '.kp-notebook-highlight';

// Selector used for logging in to amaozon
const USERNAME_SELECTOR = '#ap_email';
const PASSWORD_SELECTOR = '#ap_password';
const BUTTON_SELECTOR = '#signInSubmit';

const FIVE_SECONDS = 5 * 1000;

const randomDelay = async (page, seconds) => page.waitFor(Math.random() * seconds * 1000);


async function inputText(page, selector, text) {
  await randomDelay(page, 2);
  await page.click(selector);
  await page.keyboard.type(text);
}


async function loginToAmazon(page) {
  await page.goto(AMAZON_NOTEBOOKS_URL, {
    waitUntil: 'networkidle2',
  });

  await inputText(page, USERNAME_SELECTOR, CREDS.username);
  await inputText(page, PASSWORD_SELECTOR, CREDS.password);

  await randomDelay(page, 2);
  await page.click(BUTTON_SELECTOR);
  await page.waitForNavigation();
}


async function extractHighlightsOfBook(page) {
  return page.evaluate((HIGHLIGHT, TITLE, AUTHOR) => ({
    title: document.querySelector(TITLE).innerText,
    author: document.querySelector(AUTHOR).innerText,
    highlights: Array.from(document.querySelectorAll(HIGHLIGHT))
      .map(highlight => highlight.innerText),
  }), HIGHLIGHT_SELECTOR, TITLE_SELECTOR, AUTHOR_SELECTOR);
}


async function extractHighlights(page) {
  const books = await page.$$(BOOK_SELECTOR);
  const result = [];

  for (let index = 0; index < books.length; index += 1) {
    await books[index].click();
    // TODO: Fix this to instead wait till something appears
    await page.waitFor(FIVE_SECONDS);

    try {
      const highlights = await extractHighlightsOfBook(page);
      result.push(highlights);
    } catch (error) {
      console.log('Something went wrong with book number:', index + 1);
    }
  }

  return result;
}


module.exports = async function scrapeAmazonNotebooks() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  });

  await loginToAmazon(page);
  await randomDelay(page, 5);

  const highlightsGroupedByBooks = await extractHighlights(page);

  await page.close();
  await browser.close();

  return highlightsGroupedByBooks;
};
