var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router=express.Router();
//var utilityFunction = require('./utilityFunctions');
var session = require('express-session');
var mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/swapdb', function (err) {

    if (err) throw err;

    console.log('Successfully connected');

});

//render the index page
var app = express();
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
}));

app.set('view engine', 'ejs');
var ejsPath = require('path').join(__dirname, '/../views');
app.set('views', ejsPath);
var publicDir = require('path').join(__dirname, '/../public');
app.use(express.static(publicDir));

var profile=require('./ProfileController');
var about=require('./aboutController');
var contact=require('./contactController');
var item=require('./itemController');
var categories=require('./categoriesController');
var home=require('./homeController');
var signout=require('./signout');
var signin=require('./signin');
var register=require('./register');
var feedback=require('./feedback');
app.use(profile);
app.use(about);
app.use(contact);
app.use(item);
app.use(categories);
app.use(home);
app.use(signout);
app.use(signin);
app.use(register);
app.use(feedback);

//handling incorrect URL
app.use(function(req, res, next) {
    res.status(404).send('Resource not Found');
});

//DB connection and schema

module.exports = app;
app.listen(8080);
