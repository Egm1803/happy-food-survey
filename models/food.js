var mongoose = require('mongoose');
const Joi = require('joi');

var FoodSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    week : {type: String, required: true},
    day : {type: String, required: true},
    meal : {type: String, required: true}
  },{ timestamps: true }
);

const Food = mongoose.model('Food', FoodSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  week: Joi.string().min(1).max(1).required(),
  day: Joi.string().required(),
  week: Joi.string().required(),
  meal: Joi.string().required()
});

exports.joiSchema = joiSchema;
exports.FoodSchema = FoodSchema;
exports.Food = Food;