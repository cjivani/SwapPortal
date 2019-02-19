var createError = require('http-errors');
var userItemClass = require('../model/UserItem');
var userDbClass = require('../model/userDB');
var itemDbClass = require('../model/itemData');
var offerDbClass = require('../model/offerDb');
var signinClass = require('./signin');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router = express.Router();
var url = require('url');
var bodyParser = require('body-parser');
var isSession = false;

var userItemClass = require('../model/UserItem');
var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/myitems', async function (req, res) {
    //setting the user value from hard codes DB
    if (!req.session.theUser) {
        res.redirect('/');

    }
    if (req.session.theUser) {
        //has the item objects
        var userItems = await userItemClass.getUserItems(req.session.theUser.email);

        //check if the user initiated item was swapped
        for (var x of userItems) {
            await offerDbClass.offer.findOne({
                itemCodeOwn: x.Item,
                userID: req.session.theUser.userId,
                itemStatus: 'swapped'
            }, async function (err, value) {
                if (err) throw err;

                if (value != "" && value != null) {
                    await userItemClass.userItemData.findOneAndUpdate({Item: x.Item,Status:'pending'}, {Status: 'swapped'},
                        async function (err, useritem) {
                            if (err) throw err;
                        });
                }
            });

            //check if the item for logged in user was withdrawn by the swapper, if yes then update the user item status to available
            await offerDbClass.offer.findOne({
                itemCodeOwn: x.Item,
                userID: req.session.theUser.userId,
                itemStatus: 'withdraw'
            }, async function (err, value) {
                if (err) throw err;

                if (value != "" && value != null) {
                    await userItemClass.userItemData.findOneAndUpdate({Item: x.Item,Status:'pending'}, {Status: 'available'},
                        async function (err, useritem) {
                            if (err) throw err;
                        });
                }
            });

            await offerDbClass.offer.findOne({
                itemCodeOwn: x.Item,
                userID: req.session.theUser.userId,
                itemStatus: 'reject'
            }, async function (err, value) {
                if (err) throw err;

                if (value != "" && value != null) {
                    await userItemClass.userItemData.findOneAndUpdate({Item: x.Item,Status:'pending'}, {Status: 'available'},
                        async function (err, useritem) {
                            if (err) throw err;
                        });
                }
            });

            await offerDbClass.offer.findOne({
                itemCodeOwn: x.Item,
                userID: req.session.theUser.userId,
                itemStatus: 'pending'
            }, async function (err, value) {
                if (err) throw err;

                if (value != "" && value != null) {
                    await userItemClass.userItemData.findOneAndUpdate({Item: x.Item}, {Status: 'pending'},
                        async function (err, useritem) {
                            if (err) throw err;
                        });
                }
            });
        }
        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
        var userItemsList = [];
        for (var e of userItems) {
            //list of items from itemDb mapped to user items
            var value = await itemDbClass.getItem(e.Item);
            value.Status = await e.Status;
            await userItemsList.push(value)
        }

        isSession = true;
        await res.render('myItems', {userItemData: userItemsList, isSession: isSession});
    }


});
var pendingControl = async function (req, res, next) {
    if (req.session.theUser) {
        //var userItems = userDbClass.getUserProfile().userItems;
        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
        var userItemsList = [];
        for (var e of userItems) {
            //list of items from itemDb mapped to user items
            var x = await itemDbClass.getItem(e.Item);
            x.Status = e.Status;
            userItemsList.push(x);
        }

        var itemExists = false;
        isSession = true;
        //iterate over user items to check if the user item has offer
        /*for (var x of userItems) {
            for (var element of userItemsList) {
                if (element.itemCode === x.Item) {
                    element.Status = x.Status;
                    await offerDbClass.offer.find({itemCodeWant: x.Item,itemStatus:'pending'}, function (err, value) {
                        if (err) throw err;
                        if (value != "" && value != null) {
                            element.hasOffer = true;
                        }
                    });

                }
            }
        }*/
        for (var element of userItemsList) {
            if (element.itemCode == req.query.theItem) {
                itemExists = true;

                //update the user items
                if (req.query.action === 'update') {

                    if (element.Status === 'pending') {
                        res.swapItem = element.Item;
                        res.redirect('/myswaps');
                    }
                    if (element.Status === 'available' || element.Status === 'swapped') {

                        var itemValue = await itemDbClass.getItem(element.itemCode);
                        //if the
                        var ans = await offerDbClass.offer.findOne({
                            itemCodeWant: element.itemCode,
                            itemStatus: 'pending'
                        });
                        if (ans !== null && ans !== "" && element.Status === 'available') {

                            res.render('item', {
                                value: itemValue,
                                status: element.Status,
                                hasOffer: true,
                                isSession: true
                            });
                        }
                        if (ans !== null && ans !== "" && element.Status === 'swapped') {

                            res.render('item', {
                                value: itemValue,
                                status: element.Status,
                                hasOffer: false,
                                isSession: true
                            });
                        }
                        if (ans === null && (element.Status === 'available' || element.Status === 'swapped')) {
                            res.render('item', {
                                value: itemValue,
                                status: element.Status,
                                hasOffer: false,
                                isSession: true
                            });
                        }
                        //var hasOffer = false

                    }
                }
                //delete the user items
                if (req.query.action === 'delete') {
                    var itemCode = req.query.theItem;
                    userItemClass.userItemData.findOneAndRemove({Item: itemCode}, function (err) {
                    });
                    offerDbClass.offer.findOneAndRemove({itemCodeOwn: itemCode}, function (err) {
                    });

                    var userItems = await userItemClass.userItemData.find({userId: req.session.theUser.userId});
                    var userItemsList = [];
                    for (var e of userItems) {
                        userItemsList.push(await itemDbClass.getItem(e.Item))
                    }
                    req.session.curentProfile = userItems;
                    req.session.sessionProfile = userItemsList;
                    res.redirect('/myItems');
                }
            }
        }
        if (itemExists === false) {
            res.redirect('/myitems');
        }
    }
    else {
        res.render('index', {iSession: false});
    }

    next();
}

router.post('/myitems*', urlencodedParser, pendingControl);


/*This is the logic for swap page*/

router.get('/myswaps', async function (req, res) {
    //setting the user value from hard codes DB
    if (!req.session.theUser) {
        res.redirect('/');

    }
    if (req.session.theUser) {
        //has the item objects
        var offerItemsForUser = await offerDbClass.getOfferItems(req.session.theUser.userId);
        var userItems = [];
        for (var item of offerItemsForUser) {
            if (item.itemStatus === 'pending') {
                var userItem = await itemDbClass.getItem(item.itemCodeOwn);
                var swapItem = await itemDbClass.getItem(item.itemCodeWant);
                var finalItem = {
                    userItem: userItem,
                    swapItem: swapItem,
                    whoInitiated: item.whoInitiated
                }
                userItems.push(finalItem);
            }
        }
        isSession = true;
        res.render('mySwaps', {userItemData: userItems, isSession: isSession});

    }

});
var changeSwapStatus = async function (req, res, next) {

    if (req.session.theUser) {
        var itemExists = false;
        var userItems = await userItemClass.getUserItems(req.session.theUser.email);
        var userItemsList = [];

        for (var element of userItems) {
            if (element.Status === 'pending') {
                if (req.query.action === 'withdraw') {
                    //change the status of item to available and delete that record from offers DB
                    var offerObj = await offerDbClass.offer.findOne({itemCodeOwn: req.query.theItem}, function (err) {
                    })

                    await offerDbClass.offer.findOneAndUpdate({
                        itemCodeOwn: req.query.theItem,
                        itemStatus: 'pending'
                    }, {itemStatus: 'withdraw'}, function (err) {
                    });
                    //remove the record if created by the other user for same item

                    await offerDbClass.offer.findOneAndUpdate({
                        itemCodeOwn: offerObj.itemCodeWant,
                        itemStatus: 'pending'
                    }, {itemStatus: 'withdraw'}, function (err) {
                    });
                    await userItemClass.userItemData.findOneAndUpdate({Item: req.query.theItem}, {Status: 'available'},
                        function (err) {
                        });

                }
                if (req.query.action === 'reject') {
                    var offerObj = await offerDbClass.offer.findOne({
                        itemCodeOwn: req.query.theItem,
                        itemStatus: 'pending'
                    }, function (err) {
                    })

                    await offerDbClass.offer.findOneAndUpdate({
                        itemCodeOwn: offerObj.itemCodeOwn,
                        itemStatus: 'pending'
                    }, {itemStatus: 'reject'}, function (err) {
                    });
                    //remove the record if created by the other user for same item

                    await offerDbClass.offer.findOneAndUpdate({
                        itemCodeWant: offerObj.itemCodeOwn,
                        itemStatus: 'pending'
                    }, {itemStatus: 'reject'}, function (err) {
                    });
                    await userItemClass.userItemData.findOneAndUpdate({Item: req.query.theItem}, {Status: 'available'},
                        function (err) {
                        });

                }

            }

            if (req.query.action === 'accept') {
                await userItemClass.userItemData.findOneAndUpdate({Item: req.query.theItem,itemStatus:'pending'}, {Status: 'swapped'},
                    function (err, useritem) {
                        if (err) throw err;
                    });

                await offerDbClass.offer.findOneAndUpdate({itemCodeOwn: req.query.theItem,itemStatus:'pending'}, {itemStatus: 'swapped'},
                    function (err, useritem) {
                        if (err) throw err;
                    });

                await offerDbClass.offer.findOneAndUpdate({itemCodeWant: req.query.theItem,itemStatus:'pending'}, {itemStatus: 'swapped'},
                    function (err, useritem) {
                        if (err) throw err;
                    });


            }

        }

        //final logic to render the myitems page
        userItems = await userItemClass.getUserItems(req.session.theUser.email);
        //console.log("user items in withdraw before set:" + userItems);

        //list of user items
        for (var x of userItems) {
            var y = await itemDbClass.getItem(x.Item);
            userItemsList.push(y);
        }
        //list of items from itemDb mapped to user items
        req.session.currentProfile = userItems;
        //list of items from itemDb mapped to user items
        req.session.sessionProfile = userItemsList;
        res.redirect('/myitems');

    }
    else {
        res.render('index');
    }

    next();
}
router.post('/myswaps*', changeSwapStatus);
module.exports = router;