var mongoose = require('mongoose');
const Joi = require('joi');

var ClassroomSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, maxlength: 100},
    //ADD VALIDATOR TO DAYS AND MEAL
  },{ timestamps: true }
);

const Classroom = mongoose.model('Classroom', ClassroomSchema);

const joiSchema = Joi.object({
  name: Joi.string().min(5).max(100).required()
});

exports.joiSchema = joiSchema;
exports.ClassroomSchema = ClassroomSchema;
exports.Classroom = Classroom;