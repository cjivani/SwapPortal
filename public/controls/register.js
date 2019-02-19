var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var userDbClass = require('../model/userDB');
var userItemClass = require('../model/UserItem');
var itemDbClass = require('../model/itemData');
var username;
var {check, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

router.get('/register', function (req, res) {
    res.render('register',{errorValues:undefined});
});

router.post('/register',urlencodedParser,
    //check for the valid username and password
    [check('firstname').isAlpha().withMessage('Enter a valid first name').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
        check('lastname').isAlpha().withMessage('Enter a last name').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
        check('email').isEmail().withMessage('Enter a valid email Id').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
        check('city').isAlpha().withMessage('Enter a valid city').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
        check('state').isAlpha().withMessage('Enter a valid state').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean()
        ,
        check('postcode').isNumeric().withMessage('Enter a valid postcode').isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
        check('password').isAlphanumeric().withMessage('Enter a valid password')
    ],async function (req,res) {

        const errors = validationResult(req);
        var errorValues = [];
        //check for errors caused out of validation
        if (!errors.isEmpty()) {

            errors.array().forEach(function (element) {
                errorValues.push(element.msg);
            });
            res.render('register', {errorValues: errorValues});
        }
        else {
                var firstName=req.body.firstname;
                var lastName=req.body.lastname;
                var email=req.body.email;
                var city=req.body.city;
                var state=req.body.state;
                var postcode=req.body.postcode;
                var password=req.body.password;
                console.log("password:"+password);

                var allUsers=await userDbClass.getAllUsers();

                allUsers.forEach(function (element) {
                    if(element.email===email){
                        errorValues.push('Email already exists');
                        res.render('register',{errorValues:errorValues});
                    }
                });

                await userDbClass.addUser(firstName,lastName,email,city,state,postcode,password);

                res.redirect('/signin');
        }
    
});

module.exports.username = username;
module.exports = router;
