const express = require('express');
const router = express.Router();
const User = require('./schemas/user');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            req.session.userRole = user.role;
            req.session.save();
            if (user.role === 'admin') {
                res.status(200).json({ authenticated: true, isAdmin: true });
            } else {
                res.status(200).json({ authenticated: true, isAdmin: false });
            }
        } else {
            res.status(401).json({ authenticated: false });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
