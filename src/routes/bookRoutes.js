const express = require('express');
const {
    create, read, reads, update, deleteBook,
} = require('../controllers/bookControlers');

const bookRouter = express.Router();

bookRouter.post('/books', create);
bookRouter.get('/books', reads);
bookRouter.get('/books/:bookId', read);
bookRouter.put('/books/:bookId', update);
bookRouter.delete('/books/:bookId', deleteBook);

module.exports = bookRouter;
