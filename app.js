// A small express server providing an API for a small social networking app.

const express = require('express');
const jwt     = require('jsonwebtoken');

// Create an express app that expects JSON bodies.
const app = express();
app.use(express.json());

/* Setup request handling / routing. */
app.get('/',        (req, res) => res.send('Awesome App'));
app.use('/:router', (req, res, next) => {
    try {
        require(`./routes/${req.params.router}`);
        next();
    } catch (err) {
        res.status(404).send('Not Found');
    }
}
