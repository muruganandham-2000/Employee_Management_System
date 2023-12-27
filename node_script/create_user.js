const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/create_user', (req, res) => {
  const { fullname, qualification, contact, username, email, password, role } = req.body;

  const checkQuery = 'SELECT COUNT(*) AS countUsernameEmail FROM pydatabase.users WHERE username = ? OR email = ?';
    
  db.query(checkQuery, [username, email], (checkError, checkResults) => {
    if (checkError) {
      console.error('Database query error:', checkError);
      res.status(500).json({ error: 'Error checking for existing username or email' });
      return;
    }

    const countUsernameEmail = checkResults[0].countUsernameEmail;

    if (countUsernameEmail > 0) {
      res.status(400).json({ error: 'User already exists!' });
      return;
    }

    const insertQuery = 'INSERT INTO pydatabase.users (fullname, qualification, contact, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(insertQuery, [fullname, qualification, contact, username, email, password, role], (insertError, insertResults) => {
      if (insertError) {
        console.error('Database query error:', insertError);
        res.status(500).json({ error: 'Error creating user' });
        return;
      }

      let successMessage = '';
      if (role === 'admin') {
        successMessage = 'Admin created successfully';
      } else {
        successMessage = 'User created successfully';
      }

      // User or admin successfully created
      res.status(200).json({ message: successMessage });
    });
  });
});

module.exports = router;
