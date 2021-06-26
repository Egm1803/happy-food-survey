var express = require('express');
const config = require('config');
var session = require('express-session');


module.exports = function (req, res, next) {
    if (req.session.user.name==='Manager' || req.session.user.name==='Admin')  return next();
   
    if (req.session.user.name!=='Educator') return res.redirect('/');
    
    next();
}