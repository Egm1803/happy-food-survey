var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
const auth = require('../middleware/auth');

router.get('/', auth, asyncMiddleware(async function(req, res, next) {

    res.render('change_user', { title: 'Change User', user: req.user.name });

}));

/* POST login */
router.post('/', auth, asyncMiddleware(async function(req, res, next) {

  const { error } = joiSchema.validate(req.body);    

  if (error) return res.render('change_user',{title: 'Change User', user: req.user.name, authErr: "Invalid username or password"});
  
  let user = await User.findOne({name: req.body.name});
  if (!user) return res.render('change_user',{title: 'Change User', user: req.user.name, authErr: "Invalid username or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.render('change_user',{title: 'Change User', user: req.user.name, authErr: "Invalid username or password" });
  
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

  const userLogged = 'userLogged';

  res.cookie('rememberme', token, cookieOptions);
  res.render('change_user',{title: 'Change User', userLogged});
}));

const joiSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(1024).required(),
    remembermeChecked: Joi.string()
});

module.exports = router;
