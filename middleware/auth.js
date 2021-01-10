var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.cookies.rememberme;

    if (!token)  {
        res.redirect(401, config.get('home'));
        return;
    };

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    
    next();
}

module.exports = auth;