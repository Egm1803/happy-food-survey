var express = require('express');

module.exports = function (req, res, next) {
    if (req.user.name==='Manager' || req.user.name==='Admin')  return next();
   
    if (req.user.name!=='Educator') return res.redirect(403, 'https://happy-food-survey.herokuapp.com/');
    
    next();
}