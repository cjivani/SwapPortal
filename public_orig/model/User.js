//creating user object and associated item data, it is a constructor to create the user objects


var User = function (Userid, firstName, lastName, emailAddress, addressField1, addressField2, city, state, postcode, country) {
    return {
        UserId : Userid,
        firstName : firstName,
        lastName : lastName,
        emailAddress : emailAddress,
        addressField1 : addressField1,
        addressField2 : addressField2,
        city : city,
        state : state,
        postcode : postcode,
        country : country

    }


}

module.exports.User = User;