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
  if (req.cookies.rememberme){
    let token = req.cookies.rememberme;
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    let user = decoded;
    
    let userLogged = 'userLogged';

    res.render('index', { title: 'Logged In', user: user.name , userLogged });
  }else{ 
    //To hide the Fill Out The Form link in layout bar
    let hidden = "hidden";
    res.render('index', { title: 'Please Login', hidden  });
  }
}));

/* POST login */
router.post('/', asyncMiddleware(async function(req, res, next) {
  //check if user already logged in(MUST CHANGE HERE, id USER logged in SHOULD ONLY BE redirected to change user and login from there)
  let loggedUser = "";

  if (req.cookies.rememberme){
    let token = req.cookies.rememberme;
    let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    loggedUser = decoded;
  }

  const { error } = joiSchema.validate(req.body);    

  if (error) return res.render('index',{title: 'Please Login', user: loggedUser.name, authErr: "Invalid username or password"});
  
  let user = await User.findOne({name: req.body.name});
  if (!user) return res.render('index',{title: 'Please Login', user: loggedUser.name, authErr: "Invalid username or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.render('index',{title: 'Please Login', user: loggedUser.name, authErr: "Invalid username or password" });
  
  let cookieOptions = {};

  if (req.body.remembermeChecked === "checked") {
    cookieOptions = {
      httpOnly: true,
      maxAge : 365 * 24 * 60 * 60 * 1000 
    }
  } else {
    cookieOptions = {
      httpOnly: true,
      expires: 0
    }
  };

  const token = user.generateAuthToken();

  let userLogged = 'userLogged';

  res.cookie('rememberme', token, cookieOptions);
  res.render('index',{title: 'Please Login', userLogged});
}));

const joiSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(1024).required(),
    remembermeChecked: Joi.string()
});

module.exports = router;
