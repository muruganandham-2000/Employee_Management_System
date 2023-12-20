const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./node_script/login_routes');
const signupRoutes = require('./node_script/signup_routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(loginRoutes);
app.use(signupRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
