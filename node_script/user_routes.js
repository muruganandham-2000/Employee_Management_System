const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('./schemas/user');
const upload = multer({ dest: './public/uploads/' });

router.post('/create_user', upload.single('photo'), async (req, res) => {
  if (req.session.userRole === 'admin') {
    try {
      const { name, email, password, gender, experience, phone, qualification, department, position, address, role } = req.body;
      const photoFilename = req.file ? req.file.filename : null;

      
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ error: 'User already exists!' });
        return;
      }

      const newUser = new User({
        name,
        email,
        password,
        gender,
        profile_image: photoFilename,
        experience,
        phone,
        qualification,
        department,
        position,
        address,
        role
      });

      await newUser.save();

      let successMessage = '';
      if (role === 'admin') {
        successMessage = 'Admin created successfully';
      } else {
        successMessage = 'User created successfully';
      }

      res.status(200).json({ message: successMessage });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
