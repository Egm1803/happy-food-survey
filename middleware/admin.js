var express = require('express');
const config = require('config');

module.exports = function (req, res, next) {
    
    if (req.user.name!=='Admin') return res.redirect(403, config.get('home'));
    
    next();
}