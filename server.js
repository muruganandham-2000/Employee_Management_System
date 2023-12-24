const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./node_script/login_routes');
const userRoutes = require('./node_script/create_user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(loginRoutes);
app.use(userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
