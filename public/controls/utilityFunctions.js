var items=require('../model/itemData');
var profileControllerClass=require('./ProfileController');
var userDbClass = require('../model/userDB');
var getItem=function(itemNumber){
    var number=itemNumber;
    if(number==='I01'){
        return items.item1;
    }
    else if(number==='I02'){
        return items.item2;
    }
    else if(number==='I03'){
        return items.item3;
    }
    else if(number==='I04'){
        return items.item4;
    }
    else if(number==='I05'){
        return items.item5;
    }
    else if(number==='I06'){
        return items.item6;
    }
    else if(number==='I07'){
        return items.item7;
    }
    else if(number==='I08'){
        return items.item8;
    }
    else if(number==='I09'){
        return items.item9;
    }
    else if(number==='I10'){
        return items.item10;
    }
    else if(number==='I11'){
        return items.item11;
    }
    else{
        return "";
    }
};

var getItems=function(isSession){
    var ans=[items.item1,items.item2,items.item3,items.item4,items.item5,items.item6,items.item7,items.item8,items.item9,items.item10,items.item11];
    //console.log(req.session.theUser);
   if(isSession){
        var userItems =userDbClass.getUserProfile().userItems;
        ans.forEach(function (item) {
            userItems.forEach(function (element) {
                if(element.Item.itemCode==item.itemCode)
                    ans.splice(ans.indexOf(item),1);
            });
        });

    }
    return ans;
}

module.exports.getItem=getItem;
module.exports.getItems=getItems;