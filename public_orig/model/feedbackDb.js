var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//define the offer schema
var feedbackSchema = new Schema({
    offerId: String,
    userId: String,
    swapperId: String,
    rating: String,
    itemCode:String,
    userName:String
});


var feedbackData = mongoose.model('feedbacks', feedbackSchema);

function addOfferFeedback(offerID, userID1, userID2, rating,itemCode,userName)  {

        var feedbackObj=new feedbackData({
            offerId: offerID,
            userId: userID1,
            swapperId: userID2,
            rating: rating,
            itemCode:itemCode,
            userName:userName
        });

        feedbackObj.save(function (err) {
           if(err) throw err;

           else {
               console.log('feedback added');
           }
        });
}

function addItemFeedback(itemCode, userID, rating) {
    var feedbackObj=new feedbackData({
        itemCode:itemCode,
        userId:userID,
        rating:rating
    });
    feedbackObj.save(function (err) {
        if(err) throw err;
    })
}

module.exports.feedbackData=feedbackData;
module.exports.addItemFeedback=addItemFeedback;
module.exports.addOfferFeedback=addOfferFeedback;