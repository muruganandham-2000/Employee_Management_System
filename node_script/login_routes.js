const express = require('express');
const router = express.Router();
const db = require('./db');

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
