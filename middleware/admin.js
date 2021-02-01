var express = require('express');
const config = require('config');

module.exports = function (req, res, next) {
    
    if (req.user.name!=='Admin') return res.redirect(config.get('changeUser'));
    
    next();
}