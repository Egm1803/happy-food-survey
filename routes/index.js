var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
var session = require('express-session');

//const auth = require('../middleware/auth');

router.get('/', asyncMiddleware(async function(req, res, next) {
    //check if user logged, and send role to client
    let currentUser;
    if(req.session.user) {
      currentUser = req.session.user.name;
    }
    //currentUser is also used to hide the Fill Out The Form link in layout bar
    res.render('index',{user: currentUser});
 
}));

/* POST login */
router.post('/', asyncMiddleware(async function(req, res, next) {
  
  //check if user already logged in, to send role to client incase of authErr
  let currentUser;
  if(req.session.user) {
    currentUser = req.session.user.name;
  }
  const { error } = joiSchema.validate(req.body);    
  if (error) return res.render('index',{authErr: "Invalid username or password", user: currentUser});

  let user = await User.findOne({name: req.body.name});
  if (!user) return res.render('index',{authErr: "Invalid username or password", user: currentUser });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.render('index',{authErr: "Invalid username or password", user: currentUser });
  
  //if changing the user, clear cookie first
  if (req.cookies.my_session && !req.session.user) {
    res.clearCookie('my_session');        
  }

  req.session.user = {name: req.body.name};

  res.redirect('/api/feedbacks');
}));

const joiSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(1024).required(),
    remembermeChecked: Joi.string()
});

module.exports = router;
