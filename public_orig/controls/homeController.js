var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router=express.Router();

router.get('/', function (req, res) {
    var isSession=false;
    if(req.session.theUser){
        isSession=true;
    }
    res.render('index',{isSession:isSession});
});

module.exports=router;