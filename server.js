const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const loginRoutes = require('./node_script/login_routes');
const dashboard = require('./node_script/admin_dashboard');
const userRoutes = require('./node_script/user_routes');
const { store } = require('./node_script/schemas/db');

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
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 15 * 60 * 1000
    }
}));

app.use(express.static('public'));

app.use(loginRoutes);
app.use('/admin', dashboard);
app.use('/admin', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
