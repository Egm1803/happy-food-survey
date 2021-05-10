var express = require('express');
const config = require('config');

module.exports = function (req, res, next) {
    
    if (req.session.user.name==='Admin')  return next();
    
    if (req.session.user.name!=='Manager') return res.redirect(config.get('changeUser'));
    
    next();
}