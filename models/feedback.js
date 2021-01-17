var mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

var Schema = mongoose.Schema;

var FeedbackSchema = new Schema(
  {
    centre: {type: Schema.Types.ObjectId, ref: 'Centre', required: true},
    classroom: {type: Schema.Types.ObjectId, ref: 'Classroom', required: true},
    food: {type: Schema.Types.ObjectId, ref: 'Food', required: true},
    numberOfChildren : {type: Number,min: 0, max: 40, required: true },
    howManyFinished : {type: Number,min: 0, max: 40, required: true},
    rating : {type: Number,min: 0, max: 5, required: true},
    date : {type: Date, required: true}
  },{ timestamps: true }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

const joiSchema = Joi.object({
  centre: Joi.objectId().required(),
  classroom: Joi.objectId().required(),
  food: Joi.objectId().required(),
  numberOfChildren: Joi.number().min(0).max(40).required().label('Number Of Children'),
  howManyFinished: Joi.number().min(0).max(Joi.ref('numberOfChildren')).required()
    .label('Number of children finished their serve')
    .messages({'number.max':'Finished serves cannot be more than total children.'}),
  rating: Joi.number().min(0).max(5).required(),
  // former check for less than now 
  // date: Joi.date().less('now').required()
  // .messages({'date.less':"Date can\'t be in the future."})
  date: Joi.date().required()
});

exports.joiSchema = joiSchema;
exports.FeedbackSchema = FeedbackSchema;
exports.Feedback = Feedback;