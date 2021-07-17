var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const {Food, joiSchema} = require('../models/food');
const {Feedback} = require('../models/feedback');
//const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
var mongoose = require('mongoose');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    //get all foods from DB and sort by week and day
    //$addFields creates a field(dayValue) after matching every day to a number, which then can be sorted.
    let foods = await Food.aggregate([
        {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
        { $sort : {week : 1, dayValue : 1 } }
    ])

    res.render('add_food_form',{title: 'Add Food', foods});
    
}));

/* POST new food */
router.post('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 
   
    if (error) return res.render('add_food_form',{ valErr: error.details[0].message});

    let food = new Food({ 
        name: req.body.name,
        week: req.body.week,
        day: req.body.day,
        meal: req.body.meal

    });
    food = await food.save();
    
    let foods = await Food.aggregate([
        {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
        { $sort : {week : 1, dayValue : 1 } }
    ])

    res.render('add_food_form',{title: 'Add Food', food: food.name, foods});
}));

//Get edit food screen
router.get('/:_id', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {
  
    //get all foods from DB and sort by week and day
    //$addFields creates a field(dayValue) after matching every day to a number, which then can be sorted.
    let foods = await Food.aggregate([
        {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
        { $sort : {week : 1, dayValue : 1 } }
    ])
    // if(!validId) return res.render('add_food_form',{foods, valErr: "Can't find the food you are looking for." });
    
    let foodToEdit = await Food.findOne({_id: req.params._id});
    if (!foodToEdit) return res.render('add_food_form',{foodToEdit, foods, valErr: "Can't find the food you are looking for." });
    
    res.render('add_food_form',{ foodToEdit, foods});
    
}));

//Update food
router.post('/:_id', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 
    if (error) return res.render('add_food_form',{title: 'Add Food', valErr: error.details[0].message});

    const updatedFood = await Food.findOneAndUpdate({_id:req.params._id}, req.body, {new: true, useFindAndModify: true}).exec();
    
    let foods = await Food.aggregate([
        {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
        { $sort : {week : 1, dayValue : 1 } }
    ])
    //Even if we cant find the food to be updated, we still need the foods to populate the foods table.
    if (!updatedFood) return res.render('add_food_form',{foods, valErr: "Can't find the food you are looking for." });

    res.render('add_food_form',{ food: updatedFood.name,foods });
}));


//Delete food
router.get('/:_id/delete', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {
    
    let deletedFood = await Food.findOne({_id: req.params._id});
    if (!deletedFood){
        let foods = await Food.aggregate([
            {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
            { $sort : {week : 1, dayValue : 1 } }
        ])

        return res.render('add_food_form',{foods, valErr: "Can't find the food you are looking for." });
    }
// This aggregation method is to find and delete all feedbacks related to the food item which is to be deleted.
    const ObjectId = mongoose.Types.ObjectId; 
    let foodTodelete = await Food.aggregate([
        { 
            $match: { "_id": ObjectId(req.params._id) } 
        },
        {        
            $lookup: {
                from: "feedbacks",
                localField: "_id",
                foreignField: "food",
                as: "feedbacks"
            } 
        }
    ])
    let fdbkArray = [];
    foodTodelete[0].feedbacks.forEach(fdbk => fdbkArray.push(fdbk._id));

    await Feedback.deleteOne({_id: {$in: fdbkArray}});
    await Food.deleteOne({_id: req.params._id});
    
    let foods = await Food.aggregate([
        {$addFields:{ dayValue:{$indexOfArray:[["Monday", "Tuesday", "Wednesday","Thursday","Friday"], "$day"]}}},
        { $sort : {week : 1, dayValue : 1 } }
    ])
    res.render('add_food_form',{ foods, deletedFood: deletedFood.name});
    
}));

module.exports = router;