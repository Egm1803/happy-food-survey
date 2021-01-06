// var express = require('express');
// var router = express.Router();
// const {User} = require('../models/user');
// const bcrypt = require('bcrypt');
// const Joi = require('joi');

// router.get('/',async function(req, res, next) {

//     res.render('index',{title: 'Login'});
    
// });

// /* POST new user */
// router.post('/', async function(req, res, next) {
//     const { error } = joiSchema.validate(req.body);    
//     if (error) return res.render('index',{title: 'Login', authErr: "Invalid username or password"});

//     let user = await User.findOne({name: req.body.name});
//     if (!user) return res.render('index',{title: 'Login', authErr: "Invalid username or password" });

//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) return res.render('index',{title: 'Login', authErr: "Invalid username or password" });
     
//     res.render('index',{title: 'Login', user: user.name});
// });

// const joiSchema = Joi.object({
//     name: Joi.string().min(5).max(100).required(),
//     password: Joi.string().min(5).max(1024).required()
//   });

// module.exports = router;