/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const nanoid = require('nanoid');
const { makeFailedResponse, makeSuccessResponseWithData, makeSuccessResponse } = require('../helpers/response');

const { books, CREATE_KEY } = require('../entity/books');
const { stringToBoolean } = require('../helpers/strings');

const create = (req, res) => {
    const data = {};
    const id = nanoid.nanoid(16);

    for (const key of CREATE_KEY) {
        if (!req.body[key]) return makeFailedResponse(res, 400, `Gagal menambahkan buku. Mohon isi ${key} buku`);
        data[key] = req.body[key];
    }
    if (!req.body.name) return makeFailedResponse(res, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
    if (req.body.readPage === undefined) return makeFailedResponse(res, 400, 'Gagal menambahkan buku. Mohon isi readPage buku');
    if (req.body.pageCount === undefined) return makeFailedResponse(res, 400, 'Gagal menambahkan buku. Mohon isi readPage buku');
    if (req.body.reading === undefined) return makeFailedResponse(res, 400, 'Gagal menambahkan buku. Mohon isi reading buku');
    if (req.body.readPage > req.body.pageCount) return makeFailedResponse(res, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');

    data.insertedAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.id = id;
    data.readPage = req.body.readPage;
    data.pageCount = req.body.pageCount;
    data.reading = req.body.reading;
    data.name = req.body.name;

    data.finished = data.pageCount === data.readPage;

    books.push(data);
    const isFound = books.find((book) => book.id === id);
    if (isFound) return makeSuccessResponseWithData(res, 201, { bookId: id }, 'Buku berhasil ditambahkan');
    return makeFailedResponse(res, 500, 'Catatan gagal ditambahkan');
};

const reads = (req, res) => {
    let filteredBook = [...books];
    if (req.query.name) filteredBook = filteredBook.filter((book) => book.name.toLowerCase().includes(req.query.name.toLowerCase()));
    if (req.query.reading) filteredBook = filteredBook.filter((book) => book.reading === stringToBoolean(req.query.reading));
    if (req.query.finished) filteredBook = filteredBook.filter((book) => book.finished === stringToBoolean(req.query.finished));
    return makeSuccessResponseWithData(res, 200, { books: filteredBook.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })) });
};

const read = (req, res) => {
    const bookIndex = books.findIndex((book) => book.id === req.params.bookId);
    if (bookIndex === -1) return makeFailedResponse(res, 404, 'Buku tidak ditemukan');
    return makeSuccessResponseWithData(res, 200, { book: books[bookIndex] });
};

const update = (req, res) => {
    for (const key of CREATE_KEY) {
        if (!req.body[key]) return makeFailedResponse(res, 400, `Gagal memperbarui buku. Mohon isi ${key} buku`);
    }

    if (!req.body.name) return makeFailedResponse(res, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
    if (req.body.readPage === undefined) return makeFailedResponse(res, 400, 'Gagal memperbarui buku. Mohon isi readPage buku');
    if (req.body.pageCount === undefined) return makeFailedResponse(res, 400, 'Gagal memperbarui buku. Mohon isi pageCount buku');
    if (req.body.reading === undefined) return makeFailedResponse(res, 400, 'Gagal memperbarui buku. Mohon isi reading buku');
    if (req.body.readPage > req.body.pageCount) return makeFailedResponse(res, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');

    const bookIndex = books.findIndex((book) => book.id === req.params.bookId);
    if (bookIndex === -1) return makeFailedResponse(res, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
    const book = books[bookIndex];

    for (const key of CREATE_KEY) {
        book[key] = req.body[key];
    }

    book.insertedAt = new Date().toISOString();
    book.readPage = req.body.readPage;
    book.pageCount = req.body.pageCount;
    book.reading = req.body.reading;
    book.name = req.body.name;

    book.finished = book.pageCount === book.readPage;
    book.updatedAt = new Date().toISOString();

    return makeSuccessResponse(res, 200, 'Buku berhasil diperbarui');
};

const deleteBook = (req, res) => {
    const bookIndex = books.findIndex((book) => book.id === req.params.bookId);
    if (bookIndex === -1) return makeFailedResponse(res, 404, 'Buku gagal dihapus. Id tidak ditemukan');
    books.splice(bookIndex, 1);

    return makeSuccessResponse(res, 200, 'Buku berhasil dihapus');
};

module.exports = {
    create, reads, read, update, deleteBook,
};
