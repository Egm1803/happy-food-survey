var express = require('express');

module.exports = function (req, res, next) {
    
    if (req.user.name==='Admin')  return next();
    
    if (req.user.name!=='Manager') return res.redirect(403, 'http://https://happy-food-survey.herokuapp.com/:3000/');
    
    next();
}