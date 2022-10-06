// Express handlers for User related routes.

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create User router, default export it.
export default express.Router()

// Create a new User
router.post('/', (req, res) => {
    const {
        username,
        password,
        email,
        name,
        photo,
        bio,
    } = req.body;

    const db = require('../db').get();

    // Hash password before storing it in the database.
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // Insert the user into the database
        db.run(`
            INSERT INTO users (
                username,
                password,
                email,
                name,
                photo,
                bio
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [username, hash, email, name, photo, bio],
            (err) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                // Return JSON object with status ok.
                res.json({status: 'ok'});
            }
        );
    });
}

// Login a User
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = require('../db').get();

    // Get the user from the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        // Compare the password
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            if (!result) {
                return res.status(401).send('Invalid Credentials');
            }

            // Create a JWT for the user.
            const token = jwt.sign(
                { username: row.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                status: 'ok',
                token:  token
            });
        });
    });
}

// Get User Profile by ID.
router.get('/:id/profile', (req, res) => {
    const db = require('../db').get();
    const id = req.params.id;

    // Get the JWT from the Authorization header.
    const authHeader = req.headers['authorization'];
    const auth_token = authHeader && authHeader.split(' ')[1];

    // Verify the JWT to check user is authed correctly.
    jwt.verify(token, process.env.JWT_SECRET, (err, session) => {
        if (err) {
           return res.sendStatus(403);
        }

        // Get the user from the database.
        db.get('SELECT * FROM users WHERE username = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            if (!row) {
                return res.status(404).send('User Not Found');
            }

            res.json({
                status: 'ok',
                user:   row,
            });
        });
    });
}
