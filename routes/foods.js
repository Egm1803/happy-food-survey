var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Food, joiSchema} = require('../models/food');
//const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    res.render('add_food_form',{title: 'Add Food', user: req.session.user.name});
    
}));

/* POST new food */
router.post('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 
   
    if (error) return res.render('add_food_form',{title: 'Add Food', user: req.session.user.name, valErr: error.details[0].message});

   
    let food = new Food({ 
        name: req.body.name,
        week: req.body.week,
        day: req.body.day,
        meal: req.body.meal

    });
    food = await food.save();
     
    res.render('add_food_form',{title: 'Add Food', user: req.session.user.name, food: food.name});
}));

module.exports = router;