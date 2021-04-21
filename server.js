const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dbUrl = "mongodb+srv://admin:admin@cluster0.4dcbr.mongodb.net/travelwithlocalsdb?retryWrites=true&w=majority"
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

const mongoose = require('mongoose');
mongoose.connect(
    dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    });

// configure CORS
app.use(function (req, res, next) {
    // comma separated
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With, Origin');
    res.header('Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
require('./controllers/users-controller')(app)

app.listen(4000)