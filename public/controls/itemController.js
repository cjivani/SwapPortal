var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var items = require('../model/itemData');
var utilityFunction = require('./utilityFunctions');
var profileController = require('./ProfileController');
var userDbClass = require('../model/userDB');
var offerDbClass = require('../model/offerDb');
var userItemClass = require('../model/UserItem');
var session = require('express-session');
router.use(session({secret: "Some secret value"}));
var bodyParser = require('body-parser');
var alert = require('alert-node');
var mongoose = require('mongoose');


var urlencodedParser = bodyParser.urlencoded({extended: false});
router.get('/item', function (req, res) {
    res.render('categories', {catalogValues: undefined,isSession:undefined});

});

router.get('/item/:itemCode', async function (req, res) {
    //var value = utilityFunction.getItem(req.params.itemCode);
    // console.log(req.session.userItem);
    var item = await items.getItem(req.params.itemCode);
    var isExists = false;
    var isSession = false;
    //check if the item exists or not
    //if it does set the property to true else render the categories page
    if (item) {
        isExists = true;
    }
    else {
        res.render('categories', {catalogValues: undefined, isSession: isSession});
    }
    //check if the session exists or not
    if (req.session.theUser) {
        isSession = true;
        res.render('item', {value: item, status: 'none',isSession: isSession});
    }
    else {
        res.render('item', {value: item, status: 'none', isSession: isSession});
    }
});
var offerImpl = async function (req, res) {
    var userItems = [];
    var isSession = false;
    if (req.session.theUser) {
        isSession = true;
        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
        var finalList = [];
        /*....Logic to render the swap page from individual item page when user wants to swap his available item....*/
        if (req.query.action === 'offer') {
            for (var item of userItems) {
                if (item.Status === 'available') {
                    finalList.push(await items.getItem(item.Item));
                }
            }
            var element = await items.getItem(req.query.theItem);
            res.render('swap', {swapElement: element, userItems: finalList, isSession: isSession});
        }
        /*....Logic to render the myitems page from swap page when user initiates the swap and change status to pending....*/
        if (req.query.action === 'swapit') {
            //itemCode of the available item the user wished to swap
            var userSelection = req.body.swapOptions;

            //add offer to the offerdB
            offerDbClass.addOffer(req.session.theUser.userId,userSelection,req.query.theItem,'pending','userInitiated');


            userItemClass.userItemData.findOneAndUpdate({Item: userSelection}, {Status: 'pending'},
                async function (err, useritem) {
                    if (err) throw err;

                    if (useritem) {
                        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
                        var userItemsList=[];
                        for(var e of userItems) {
                            //list of items from itemDb mapped to user items
                            userItemsList.push(await items.getItem(e.Item))
                        }
                        //list of user items
                        req.session.currentProfile =  userItems;
                        //list of items from itemDb mapped to user items
                        req.session.sessionProfile =  userItemsList;
                        res.redirect('/myitems');
                    }
                });

        }

        if (req.query.action === 'getoffer') {

            //update the user item status to pending
            userItemClass.userItemData.findOneAndUpdate({Item: req.query.theItem}, {Status: 'pending'},
                async function (err, useritem) {
                    if (err) throw err;
                    if (useritem) {
                        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
                        //list of user items
                        //req.session.currentProfile =  userItems;
                    }
                });



            //console.log("in getoffer condition:" + req.query.theItem);
            var offerObj=await offerDbClass.offer.find({itemCodeWant:req.query.theItem});
            await offerDbClass.addOffer(req.session.theUser.userId,req.query.theItem,offerObj[0].itemCodeOwn,'pending','swapperInitiated');
            res.redirect('/myswaps');
        }
    }
    else {
        res.redirect('/');
    }
};

router.post('/item*', urlencodedParser, offerImpl);

module.exports = router;