const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const query = 'SELECT * FROM pydatabase.users WHERE (username = ? OR email = ?) AND password = ?';

  db.query(query, [usernameOrEmail, usernameOrEmail, password], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });
});

module.exports = router;
