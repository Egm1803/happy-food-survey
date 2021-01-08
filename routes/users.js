var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User, joiSchema} = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', asyncMiddleware( async function(req, res, next) {

    res.render('users',{title: 'Add User', user: req.body.name });
    
}));
// , [auth,admin]
/* POST new user */
router.post('/', asyncMiddleware( async function(req, res, next) {
    const { error } = joiSchema.validate(req.body);    
    if (error) return res.render('users',{title: 'Add User',user: req.body.name, valErr: error.details[0].message});

    let user = await User.findOne({name: req.body.name});
    if (user) return res.render('users',{title: 'Add User', authErr: "This user already exists.",user: req.body.name });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    user = new User({ 
        name: req.body.name,
        password: hashed
    });
    
    user = await user.save();
     
    res.render('users',{title: 'Add User', user: req.body.name, newUser: req.body.name});
}));

module.exports = router;