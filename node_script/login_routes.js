const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT role FROM pydatabase.users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            const { role } = results[0]; // Extracting role from results
            req.session.userRole = role; // Storing only the role in session
            req.session.save();
            if (role === 'admin') {
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
