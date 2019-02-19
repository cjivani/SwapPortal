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

router.get('/signin', function (req, res) {
    res.render('login', {errorValues: undefined});
});

router.post('/signin',urlencodedParser,
    //check for the valid username and password
    [check('username').isEmail().withMessage('Enter a valid email Id').not().isEmpty().trim().escape(),sanitizeBody('notifyOnReply').toBoolean(),
       check('password').isAlphanumeric().withMessage('Enter a valid password')
        ]
    , async function (req, res) {
        if (!req.session.theUser) {
            const errors = validationResult(req);
            var errorValues = [];
            //check for errors caused out of validation
            if (!errors.isEmpty()) {

                errors.array().forEach(function (element) {
                    errorValues.push(element.msg);
                });
                res.render('login', {errorValues: errorValues});
            }
            //if no errors check for the valid credentials
            else {
                username = req.body.username;
                var password = req.body.password;
                var userObj = await userDbClass.getUser(username, password);
                if (userObj) {
                    req.session.theUser = userObj;
                    //list of user items
                    var userItems = await userItemClass.getUserItems(username);
                    var userItemsList = [];
                    for (var e of userItems) {
                        //list of items from itemDb mapped to user items
                        userItemsList.push(await itemDbClass.getItem(e.Item))
                    }
                    //list of user items
                    req.session.currentProfile = userItems;
                    //list of items from itemDb mapped to user items
                    req.session.sessionProfile = userItemsList;
                    res.redirect('/myItems');
                }
                //if invalid credentials then render back the login page
                else {
                    errorValues.push('Invalid Login Id or password');
                    res.render('login', {errorValues: errorValues});
                }
            }


        }
    });

module.exports.username = username;
module.exports = router;
