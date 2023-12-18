const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Muruga@2000',
  database: 'pydatabase'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM pydatabase.users WHERE username = ? AND password = ?';
  
  try {
    connection.query(query, [username, password], (error, results) => {
      if (error) {
        console.error('Database query error:', error); // Log the database query error
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        res.status(200).json({ authenticated: true });
      } else {
        res.status(401).json({ authenticated: false });
      }
    });
  } catch (err) {
    console.error('Database query execution error:', err); // Log any error in executing the query
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Welcome to Faculty Management System');
});



// Piece of code requires in future

// app.post('/login', (req, res) => {
//   const { usernameOrEmail, password } = req.body;

//   const query = 'SELECT * FROM pydatabase.users WHERE (username = ? OR email = ?) AND password = ?';
  
//   try {
//     connection.query(query, [usernameOrEmail, usernameOrEmail, password], (error, results) => {
//       if (error) {
//         console.error('Database query error:', error); // Log the database query error
//         res.status(500).json({ error: 'Internal server error' });
//         return;
//       }

//       if (results.length > 0) {
//         res.status(200).json({ authenticated: true });
//       } else {
//         res.status(401).json({ authenticated: false });
//       }
//     });
//   } catch (err) {
//     console.error('Database query execution error:', err); // Log any error in executing the query
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });