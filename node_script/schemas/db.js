const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const uri = "mongodb+srv://muruganandham5080:gmafPArN0Ns3yo2m@cluster0.ipyesgr.mongodb.net/EmployeeSphere?retryWrites=true&w=majority";

mongoose.connect(uri);
const db = mongoose.connection;

const store = new MongoDBStore({
    uri: uri,
    collection: 'sessions'
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = {
    mongoose: mongoose,
    store: store
};
