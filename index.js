const scrapeAmazonNotebooks = require('./amazon');
const insertToSheets = require('./sheets');

async function run() {
  const highlights = await scrapeAmazonNotebooks();
  insertToSheets(highlights);
}

run();
