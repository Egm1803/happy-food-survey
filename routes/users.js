var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User, joiSchema} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', [auth,admin], asyncMiddleware( async function(req, res, next) {
    
    res.render('users',{title: 'Add User', user: req.session.user.name });
    
}));

/* POST new user */
router.post('/', [auth,admin], asyncMiddleware( async function(req, res, next) {
    const { error } = joiSchema.validate(req.body);    
    if (error) return res.render('users',{title: 'Add User',user: req.session.user.name, valErr: error.details[0].message});

    let user = await User.findOne({name: req.body.name});
    if (user) return res.render('users',{title: 'Add User', authErr: "This user already exists.",user: req.session.user.name });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    user = new User({ 
        name: req.body.name,
        password: hashed
    });
    
    user = await user.save();
     
    res.render('users',{title: 'Add User', user: req.session.user.name, newUser: req.body.name});
}));

module.exports = router;