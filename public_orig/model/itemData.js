//creating java item objects

var mongoose = require('mongoose');


var Schema = mongoose.Schema;
//define the item schema
var itemSchema = new Schema({
    itemCode: String,
    itemName: String,
    catalogCategory: String,
    description: Array,
    rating: String,
    imageUrl: String
});

var itemsData = mongoose.model('items', itemSchema);

//return all the items from the items table
var getAllItems =function () {
    try {
        return itemsData.find({});
    } catch(err) {
        console.log(err);
    }
};
//get the item from items table on the itemCode
var getItem=function(itemCode){
    try {
        return itemsData.findOne({itemCode:itemCode});
    } catch(err) {
        console.log(err);
    }
};

//create the item object to persist to the database
function addItem(itemCode,itemName,catalogCategory,description,rating,imageUrl){
    //create a new document
    var itemObj=new itemsData({
        itemCode: itemCode,
        itemName: itemName,
        catalogCategory: catalogCategory,
        description: description,
        rating: rating,
        imageUrl: imageUrl
    });
    addItem(itemObj);
};

function addItem(itemValue){
    itemValue.save(function (err) {
        if(err) throw err;

        console.log("Item added");
    })
}

//persist the item object to the database

module.exports.itemData = itemsData;
module.exports.getAllItems = getAllItems;
module.exports.getItem=getItem;
module.exports.addItem=addItem;

