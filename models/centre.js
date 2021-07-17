var mongoose = require('mongoose');
const {ClassroomSchema} = require('./classroom');
const Joi = require('joi');

var CentreSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    classroom :[{type: String, required: true, maxlength: 100}]
   
  },{ timestamps: true }
);

const Centre = mongoose.model('Centre', CentreSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  classroom: Joi.array().items(Joi.string().min(1).max(100).required())
});

exports.joiSchema = joiSchema;
exports.CentreSchema = CentreSchema;
exports.Centre = Centre;