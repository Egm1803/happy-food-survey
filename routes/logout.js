var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');

router.get('/', auth, asyncMiddleware(async function(req, res, next) {
    //To hide the Fill Out The Form link in layout bar
    res.clearCookie('my_session');
    res.redirect('/');
}));

module.exports = router;