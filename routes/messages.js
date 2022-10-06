const express = require('express');
const jwt = require('jsonwebtoken');

export default express.Router()

router.post('/', (req, res) => {
    const database = require('../db').get();
    const { recipient, message } = req.body;
    const username = jwt.decode(
        req.headers.authorization.split(' ')[1]
    ).username;
    database.run(`
        INSERT INTO messages (username, recipient, message, timestamp) VALUES (?, ?, ?, ?)`,
        [username, recipient, message, Date.now()],
        (err) => res.json({status: 'ok'}),
    );
}

router.get('/', (req, res) => {
    const database = require('../db').get();
    const username = jwt.decode(
        req.headers.authorization.split(' ')[1]
    ).username;
    database.all(`
        SELECT * FROM messages WHERE recipient = ?`,
        [username],
        (err, rows) => res.json(rows),
    );
}

router.get('/search', (req, res) => {
    const db = require('../db').get();
    const term = req.query.term;
    db.all(`SELECT * FROM messages`,
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(
                rows.filter((row) => row.message.includes(term)
            );
        }
    );
}
