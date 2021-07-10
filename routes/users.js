var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User, joiSchema} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', [auth,admin], asyncMiddleware( async function(req, res, next) {
    let userList = await User.find().select('name');

    res.render('users',{user: req.session.user.name, userList });
    
}));
// Get user edit screen
router.get('/:user', [auth,admin], asyncMiddleware( async function(req, res, next) {
    let userList = await User.find().select('name');
    res.render('users',{userList ,user: req.session.user.name, roleToEdit: req.params.user });
    
}));

// Change user password
router.post('/:user', [auth,admin], asyncMiddleware( async function(req, res, next) {

    let user = await User.findOne({name: req.params.user});
    if (!user) return res.render('users',{authErr: "Invalid username or password" });
    
    
    const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!validPassword) return res.render('users',{authErr: "Invalid username or password" });


    if (req.body.newPassword !== req.body.newPasswordSecond) return res.render('users',{authErr: "New passwords don't match" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.newPassword, salt);
    
    user.password = hashed;
    
    user = await user.save();
    
    res.render('users',{ user: req.session.user.name});
}));

module.exports = router;