const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/signup', (req, res) => {
  const { fullname, email, username, password } = req.body;

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
  
      const insertQuery = 'INSERT INTO pydatabase.users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
    
      db.query(insertQuery, [fullname, email, username, password], (insertError, insertResults) => {
        if (insertError) {
          console.error('Database query error:', insertError);
          res.status(500).json({ error: 'Error creating user' });
          return;
        }
  
        // User successfully created
        res.status(200).json({ message: 'User created successfully' });
      });
    });
  });
module.exports = router;
