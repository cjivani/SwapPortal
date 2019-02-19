var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//define the offer schema
var offerSchema = new Schema({
    userID: String,
    itemCodeOwn: String,
    itemCodeWant: String,
    itemStatus: String,
    whoInitiated: String
});


var offer = mongoose.model('offers', offerSchema);
function addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus,whoInitiated){

    var offerObj = new offer({
        userID: userID,
        itemCodeOwn: itemCodeOwn,
        itemCodeWant: itemCodeWant,
        itemStatus: itemStatus,
        whoInitiated:whoInitiated
    });
    offerObj.save(function (err) {
        if (err) throw err;
    });
}
function updateOffer(offerId,itemStatus){
    offer.findOneAndUpdate({offerId: offerId},{itemStatus:itemStatus});
}
var getOfferItems=function(userId){
    return offer.find({userID:userId});
}
module.exports.addOffer=addOffer;
module.exports.getOfferItems=getOfferItems;
module.exports.offer=offer;
