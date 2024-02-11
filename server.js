const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.options('*', cors());


// API routes
app.use('/accounts', require('./controller/accounts.controller'));

// Global error handler
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    logger(`Server listening on port ${port}`);
});

function logger(message) {
    console.log(`[LOGGER] ${message}`);
}

function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            logger(`Error: ${err}`);
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            logger('Unauthorized Error');
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            logger(`Internal Server Error: ${err.message}`);
            return res.status(500).json({ message: err.message });
    }
}
