const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const loginRoutes = require('./node_script/login_routes');
const dashboard = require('./node_script/admin_dashboard');
// const tasks = require('./node_script/tasks_routes');
const userRoutes = require('./node_script/user_routes');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: generateRandomString(32),
    resave: false, 
    saveUninitialized: false
}));


app.use(express.static('public'));

app.use(loginRoutes);
app.use('/admin', dashboard);
// app.use('/admin', tasks); 
app.use('/admin', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
