const GoogleSpreadsheet = require('google-spreadsheet');
const { sheets: { sheetID, credentials } } = require('./credentials.json');


// flat returns an array after flattening all the
const flat = arr => arr.reduce((res, it) => res.concat(Array.isArray(it) ? flat(it) : it), []);


// sumUsing calculates sums up the values prodvided by transform function applied
// each element of the given array
const sumUsing = (arr, fn) => arr.reduce((sum, it) => sum + fn(it), 0);


// associate Returns a Map containing key-value pairs provided by
// transform function applied to elements of the given array.
const associate = (arr, fn) => arr.reduce((m, it) => m.set(fn(it), it), new Map());


// numberOfHighLights counts the total number of highlights in an array of books
const getNumberOfHighLights = books => sumUsing(books, it => it.highlights.length);


// createRowColumnIndexGrid takes an array of cells and return a map of each cell
// mapped agaist the its rowNumber-columnNumber
const createRowColumnIndexGrid = cells => associate(cells, it => `${it.row}-${it.col}`);


function insertHighlights(sheet, books) {
  const numberOfHighLights = getNumberOfHighLights(books);

  sheet.getCells({
    'min-row': 2,
    'max-row': 1 + numberOfHighLights,
    'min-col': 1,
    'max-col': 3,
    'return-empty': true,
  }, (err, cells) => {
    if (err) {
      console.log(err);
      return;
    }

    const cellIndex = createRowColumnIndexGrid(cells, numberOfHighLights, 3);

    let curPos = 0;
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      for (let j = 0; j < book.highlights.length; j++) {
        cellIndex.get(`${curPos + 2}-1`).value = book.title;
        cellIndex.get(`${curPos + 2}-2`).value = book.author;
        cellIndex.get(`${curPos + 2}-3`).value = book.highlights[j];

        curPos += 1;
      }
    }

    sheet.bulkUpdateCells(Array.from(cellIndex.values()), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}


module.exports = function insertToSheet(books) {
  const doc = new GoogleSpreadsheet(sheetID);

  doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    doc.getInfo((err, info) => {
      if (err) {
        console.log(err);
        return;
      }

      insertHighlights(info.worksheets[0], books);
    });
  });
};
