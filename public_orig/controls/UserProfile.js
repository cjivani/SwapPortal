var userData = require('../model/userDB');
var userItemClass = require('../model/UserItem');
var items = require('../model/itemData');
var userId;


var userObj = userData.user1;
var userItem1 = userItemClass.UserItem

(
    {
        itemCode: "I02",
        itemName: 'BESTON Women\'s Fashion Calf Flat Heel Side Zipper Slouch Ankle Boots',
        catalogCategory: 'boots',
        description: ['Synthetic', 'Shaft measures approximately 5" from arch', 'Manmade sole', 'Fashion Womens Winter Boots', 'Suede material upper', 'Measures 0.5 inch heel on a 0.15 inch platform'],
        rating: 3,
        imageUrl: '../Images/Boot_2.jpg'
    },
    '3', 'swapped',
    {
        "itemCode": "I08",
        itemName: 'LifeStride Women\'s Solace Dress Pump',
        catalogCategory: 'pumps',
        description: ['Fabric',
            'Imported',
            'Synthetic sole',
            'Heel measures approximately 2.75"',
            'Platform measures approximately 0.25 inches',
            'Features lifestride soft system',
            'Highly flexible outsole',
            'High-rebound foam insole and heel cushion',
            'Designed for stability and balance'],
        rating: 4.5,
        imageUrl: '../Images/pump_1.jpg'
    }, '4', '3', '');
var userItem2 = userItemClass.UserItem
({
        itemCode: "I05",
        itemName: 'ASICS Men\'s GEL Venture 5 Running Shoe',
        catalogCategory: 'sneakers',
        description: ['Textile and Synthetic', 'Imported', 'Rubber sole', 'Shaft measures approximately low-top from arch',
            'Synthetic Leather and Mesh Upper: Lightweight, comfortable and breathable, enhancing performance and fit',
            'Reinforced Stitched Toe Cap: Added durability'],
        rating: 4,
        imageUrl: '../Images/sneaker_2.jpg'
    }, '2', 'pending',
    {
        "itemCode": "I10",
        itemName: 'Ollio Women\'s Shoe Ballet',
        catalogCategory: 'sneakers',
        description: ['Synthetic',
            'syntheric sole',
            'Manmade Material',
            'Faux-Suede',
            'Flat-shoes',
            'Heel Height: 0.4"',
            'Origin: Made in China'],
        rating: 4.5,
        imageUrl: '../Images/flats_2.jpg'
    }, '', '', 'userInitiated');
var userItem3 = userItemClass.UserItem
({
        "itemCode": "I11",
        itemName: 'Fergalicious Women\'s Lexy Western Boot',
        catalogCategory: 'boots',
        description: ['Man Made Leather',
            'Imported',
            'Synthetic sole',
            'Shaft measures approximately 17" from arch',
            'Heel measures approximately 2.5 inches"',
            'Platform measures approximately 0.25',
            'Boot opening measures approximately 15" around',
            'Tall boot with slouched shaft featuring spur buckle behind stacked block heel',
            'Full-length zip entry',
            'Smooth lining, cushioning insole for all-day comfort'],
        rating: 4.5,
        imageUrl: '../Images/Boot_5.jpg'
    }
    , '5', 'available', '', '', '', '');
var userItem4 = userItemClass.UserItem
({
        "itemCode": "I04",
        itemName: 'Adidas Women\'s Cloudfoam Advantage Fashion Sneaker',
        catalogCategory: 'sneakers',
        description: ['Leather/Synthetic', 'Imported', 'Rubber sole', 'Shaft measures approximately low-top from arch',
            'Leather upper is smooth and durable. Fit tip- If in between sizes, for tight fit, go one size down and for loose fit, go one size up',
            'Iridescent 3-Stripes and heel patch for a standout look; Woven tongue label and embossed heel logo provide classic style; ' +
            'Textile lining for comfort', 'cloudfoam SURROUND sockliner has memory foam that molds to the foot for superior step-in comfort',
            'cloudfoam midsole for step-in comfort and superior cushioning', 'Rubber outsole provides secure traction'],
        rating: 4.5,
        imageUrl: '../Images/sneaker_1.jpg'
    },
    '5', 'available',
    {
        itemCode: "I01",
        itemName: "Forever Women Buckle Strap Block Heel Ankle Boots",
        catalogCategory: "boots",
        description: ["Synthetic", "Imported", "Synthetic sole", "Shaft measures approximately 3.5 from arch", "Platform measures approximately 0.25", "SyntheticSynthetic"],
        rating: "4",
        imageUrl: "../Images/Boot_1.jpg"
    }, '', '', 'swapperInitiated');

function UserProfile(userId, userItems) {
    return {
        userId: userId,
        userItems: userItems
    }
}

var getUserItems = function () {
    //setting the useritems from item DB
    var userItems = [userItem1, userItem2, userItem3, userItem4];
    return userItems;
};
var removeUserItem = function (item, itemList) {
    //console.log(itemList);
    var itemList = itemList;
    //var newItemList=[];
    itemList.forEach(function (element) {
        if (element.Item.itemCode === item.Item.itemCode) {
            itemList.splice(itemList.indexOf(element), 1);
        }
    });
    return itemList;
}
var emptyProfile = function () {
    return [];
}
var items;
var setupdatedItemList = function (itemList) {
    items = itemList;
}
var getUpdatedItemList = function () {
    return items;
}


module.exports.getUserItems = getUserItems;
module.exports.UserProfile = UserProfile;
module.exports.removeUserItem = removeUserItem;
module.exports.emptyProfile = emptyProfile;
module.exports.setupdatedItemList = setupdatedItemList;
module.exports.getUpdatedItemList = getUpdatedItemList;