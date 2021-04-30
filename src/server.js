const express = require('express');
const bookRouter = require('./routes/bookRoutes');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bookRouter);

app.listen(3000).on('listening', () => {
    console.log('🚀 are live on 3000');
});
