var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
//const auth = require('../middleware/auth');

router.get('/', asyncMiddleware(async function(req, res, next) {
  // throw new Error('fake1 - something failed in index');    
  if (req.cookies.rememberme){
      const token = req.cookies.rememberme;
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      const user = decoded;
      
      res.render('index', { title: 'Change User', user: user.name });
    }
    else res.render('index', { title: 'Please Login' });
}));

/* POST login */
router.post('/', asyncMiddleware(async function(req, res, next) {
    //console.log(req.body);
    const { error } = joiSchema.validate(req.body);    
  
    if (error) return res.render('index',{title: 'Please Login', user: req.body.name, authErr: "Invalid username or password"});
    console.log(req.user);
    let user = await User.findOne({name: req.body.name});
    if (!user) return res.render('index',{title: 'Please Login', user: req.body.name, authErr: "Invalid username or password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.render('index',{title: 'Please Login', authErr: "Invalid username or password" });
    
    const cookieOptions = {
      httpOnly: true,
      expires: 0 
    };

    const token = user.generateAuthToken();

    const userLogged = 'userLogged';

    res.cookie('rememberme', token, cookieOptions);
    res.render('index',{title: 'Please Login', userLogged});
    
}));

const joiSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(1024).required()
});

module.exports = router;
