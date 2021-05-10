var mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

var UserSchema = new mongoose.Schema(
  {
    name: {type: String, minlength: 5, maxlength: 50,unique: true, required: true},
    password : {type: String, minlength: 5, maxlength: 1024, required: true}
  },{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(5).max(1024).required()
});

exports.joiSchema = joiSchema;
exports.UserSchema = UserSchema;
exports.User = User;