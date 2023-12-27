const express = require('express');
const router = express.Router();
const db = require('./db');
const session = require('express-session');
const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

router.use(session({
    secret: generateRandomString(32),
    resave: false,
    saveUninitialized: true
}));

router.post('/login', (req, res) => {
    const { username_or_email, password } = req.body;

    const query = 'SELECT * FROM pydatabase.users WHERE (username = ? OR email = ?) AND password = ?';
    db.query(query, [username_or_email, username_or_email, password], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            req.session.user = user; 
            if (user.role === 'admin') {
                res.status(200).json({ authenticated: true, isAdmin: true });
            } else {
                res.status(200).json({ authenticated: true, isAdmin: false });
            }
        } else {
            res.status(401).json({ authenticated: false });
        }
    });
});

module.exports = router;
