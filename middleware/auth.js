var express = require('express');
// var router = express.Router();
// const config = require('config');
// var session = require('express-session')

module.exports = function (req, res, next) {
    if (!req.session.user || !req.cookies.my_session)  {
        res.redirect('/');
        return;
    }else if (req.session.user && req.cookies.my_session) next();
    
}
