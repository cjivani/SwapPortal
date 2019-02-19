var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var router=express.Router();

router.get('/signout', function (req, res) {
    req.session.destroy();
    var isSession=false;
    res.redirect('/');
});

module.exports=router;