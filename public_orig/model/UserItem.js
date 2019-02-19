//class to create the User items
var userDb = require('./userDB');
var itemData = require('./itemData');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserItemSchema = new Schema({
    userId: String,
    Item: String,
    Rating: String,
    Status: String
});
var userItemData = mongoose.model('useritems', UserItemSchema);


var getUserItems = async function (email) {
    //get user object for given email
   // var userObj = await userDb.getUser(email);
    //get the userId

    var userObj1=await userDb.userData.findOne({email:email});
    var userId = await userObj1.userId;

    //get the user objects for given user Id
    return userItemData.find({userId: userId});

}

module.exports.getUserItems = getUserItems;
module.exports.userItemData=userItemData;