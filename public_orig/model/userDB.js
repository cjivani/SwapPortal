var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//define the user schema
var userSchema = new Schema({
    _id:String,
    firstName: String,
    lastName: String,
    email: String,
    city: String,
    state: String,
    pincode: String,
    password:String,
    userId:String
});

var userData = mongoose.model('user', userSchema);

//return all the user data from user table
var getAllUsers=function () {
    try {
        return userData.find({});
    } catch(err) {
        console.log(err);
    }
}

//return the given user data from user table
var getUser =function (email,password) {
    try {
        return userData.findOne({email:email,password:password});
    } catch(err) {
        console.log(err);
    }
}

//create the user object to persist to the database
async function addUser(firstName,lastName,email,city,state,pincode,password){
    //create a new document

    var count=await userData.find().count();
    console.log(count);
    var userObj=new userData({
        _id:'U0'+(count+1),
        firstName: firstName,
        lastName: lastName,
        email: email,
        city: city,
        state: state,
        pincode: pincode,
        password:password,
        userId:'U0'+(count+1)
    });
   // addUser(userObj);
    userObj.save(function (err) {
        if(err) throw err;

        console.log("User added");
    });
};


module.exports.getAllUsers=getAllUsers;
module.exports.getUser=getUser;
module.exports.addUser=addUser;
module.exports.userData=userData;
