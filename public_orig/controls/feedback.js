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
var offerDbClass = require('../model/offerDb');
var feedbackDbClass=require('../model/feedbackDb');
var username;
var {check, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var flash = require('req-flash');
router.use(flash());

router.post('/feedback*', urlencodedParser,async function (req, res) {
    var isSession=false;
    if(req.session.theUser){
        isSession=true;
    }
    var itemCode=req.query.itemCode;
    var itemName=itemDbClass.getItem(itemName);

    var feedbackValues=await feedbackDbClass.feedbackData.find({itemCode:itemCode});

    var userItem=false;
    //req.session.theUser.rateItem=itemCode;
    if(req.session.theUser){
        var offerItems = await offerDbClass.offer.findOne({userID:req.session.theUser.userId,itemStatus:'swapped'});
        var otherUserOffer= await offerDbClass.offer.findOne({itemCodeOwn:offerItems.itemCodeWant,itemStatus:'swapped'});

        console.log(offerItems);
           if(offerItems.itemCodeWant ===itemCode){
               userItem=true;

               if(feedbackValues!=undefined){
                   res.render('feedback',{userItem:true,itemCode:itemCode,feedbackValues:feedbackValues,isSession:true});
               }
               else {
                   res.render('feedback',{userItem:true,itemCode:itemCode,feedbackValues:undefined,isSession:true});
               }

           }
           else{
               if(feedbackValues!=undefined){
                   res.render('feedback',{userItem:false,itemCode:itemCode,feedbackValues:feedbackValues,isSession:true});
               }
               else {
                   res.render('feedback',{userItem:false,itemCode:itemCode,feedbackValues:undefined,isSession:true});
               }

           }
    }
    else {
        if(feedbackValues!=undefined){
            res.render('feedback',{userItem:false,itemCode:itemCode,feedbackValues:feedbackValues,isSession:false});
        }
        else {
            res.render('feedback',{userItem:false,itemCode:itemCode,feedbackValues:undefined,isSession:false});
        }
    }

    if(userItem===true && req.query.action==='rate'){
        feedbackDbClass.addOfferFeedback(offerItems._id,offerItems.userID,otherUserOffer.userID,req.body.comment,req.query.itemCode,req.session.theUser.firstName);
        var feedbackValues=await feedbackDbClass.feedbackData.find({itemCode:itemCode});
        res.render('feedback',{userItem:false,itemCode:itemCode,feedbackValues:feedbackValues,isSession:true});
    }
});

module.exports = router;
