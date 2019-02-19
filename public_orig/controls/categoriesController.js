var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var items = require('../model/itemData');
var utilityFunction = require('./utilityFunctions');
var userItemClass = require('../model/UserItem');
var offerDbClass=require('../model/offerDb');

router.get('/categories', async function (req, res) {
    var isSession = false;
    if (req.session.theUser) {
        isSession = true;
    }
    var catalogCat = req.query.catalogCategory;
    var out = [];
    if (catalogCat === 'boots' || catalogCat === 'sneakers') {
        var catalogValues = await items.getAllItems();
        //filter out of the items if user is logged in
        if (req.session.theUser) {
            var userItems = await userItemClass.getUserItems(req.session.theUser.email);
            userItems.forEach(function (x) {
                catalogValues.forEach(function (element) {
                    if (x.Item === element.itemCode) {
                        catalogValues.splice(catalogValues.indexOf(element), 1);
                    }
                });
            });


            var offerObj = await offerDbClass.offer.findOne({
                userID: req.session.theUser.userId,
                itemStatus: 'pending'
            });

            if (offerObj != null) {
                for (var element of catalogValues) {
                    if (element.itemCode === offerObj.itemCodeWant) {
                        catalogValues.splice(catalogValues.indexOf(element), 1);
                    }
                }
            }

        }
        for (var element of catalogValues) {
            if (element.catalogCategory === catalogCat) {
                out.push(element);
            }
        }
    }
    res.render('categories', {catalogValues: out, isSession: isSession});

});

module.exports = router;