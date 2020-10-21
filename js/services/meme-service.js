'use strict'
var gImgs;
var gMemes;

const STORAGE_KEY = 'imgsDB';

function init() {
    _createImgs();
}



function getImgsForDisplay() {
    return gImgs;
}



function _createImgs() {
    let memeImgs = loadFromStorage(STORAGE_KEY);
    if (!memeImgs) {
        memeImgs = [];
        for (let i = 1; i <= 18; i++) {
            memeImgs.push(_createImg(i));
        }
    }
    gImgs = memeImgs;
    saveImgsToStorage();
}



function _createImg(url, keywords = []) {
    return {
        id: makeId(),
        url,
        keywords
    }
}


function saveImgsToStorage() {
    saveToStorage(STORAGE_KEY, gImgs)
}

function getBooks() {
    sort();
    var fromIdx = gPageIdx * PAGE_SIZE;
    return gBooks.slice(fromIdx, fromIdx + PAGE_SIZE)
}

function getTitles() {
    return gTitles;
}

function deleteBook(bookId) {
    var bookIdx = gBooks.findIndex(book => {
        return bookId === book.id
    })
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage();
}

function addBook(title, price) {
    var book = _createBook(title)
    book.price = price;
    gBooks.unshift(book)
    _saveBooksToStorage();
}

function getBookById(bookId) {
    var book = gBooks.find(book => {
        return bookId === book.id
    })
    return book
}

function updateBook(bookId, newPrice) {
    var bookIdx = gBooks.findIndex(book => {
        return book.id === bookId;
    })
    gBooks[bookIdx].price = newPrice;
    _saveBooksToStorage();
}

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gBooks.length) gPageIdx = 0;

}
function prevPage() {
    if (gPageIdx === 0) return;
    gPageIdx--;
}

function _createMeme() {
    var gMeme =
    {
        selectedImgId: 5,
        selectedLineIdx: 0,
        lines: [{
            txt: 'first try',
            size: 20,
            align: 'left',
            color: 'red'
        }]
    }
}




function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 11; i++) {
            var title = gTitles[getRandomIntInclusive(0, gTitles.length - 1)]
            books.push(_createBook(title))
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


function updateBookRate(bookId, rate = 0) {
    var bookIdx = gBooks.findIndex(book => {
        return book.id === bookId;
    })
    if (gBooks[bookIdx].rate === 0 && rate === -1 || gBooks[bookIdx].rate === 10 && rate === 1) return
    gBooks[bookIdx].rate += rate;
    _saveBooksToStorage();
}

function setSort(sortBy) {
    gSortBy = sortBy;
}
function sort() {
    gBooks.sort((book1, book2) => {
        if (gSortBy === 'title') {
            return book1.title.localeCompare(book2.title)
        }
        return book1[gSortBy] > book2[gSortBy] ? 1 : -1;
    })
}
