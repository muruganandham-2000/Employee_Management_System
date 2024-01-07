const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('./db');

const upload = multer({ dest: './public/uploads/' });
router.post('/create_user', upload.single('photo'), (req, res) => {
  if (req.session.userRole === 'admin') {
    const { name, email, password, gender, experience, phone, qualification, department, position, address, role } = req.body;
    const photoFilename = req.file ? req.file.filename : null;

    const checkQuery = 'SELECT COUNT(*) AS countEmail FROM pydatabase.users WHERE email = ?';
      
    db.query(checkQuery, [email], (checkError, checkResults) => {
      if (checkError) {
        console.error('Database query error:', checkError);
        res.status(500).json({ error: 'Error checking for existing username or email' });
        return;
      }

      const countEmail = checkResults[0].countEmail;

      if (countEmail > 0) {
        res.status(400).json({ error: 'User already exists!' });
        return;
      }

      const insertQuery = 'INSERT INTO pydatabase.users (name, email, password, gender, profile_image, experience, phone, qualification, department, position, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      db.query(insertQuery, [name, email, password, gender, photoFilename, experience, phone, qualification, department, position, address, role], (insertError) => {
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
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;

