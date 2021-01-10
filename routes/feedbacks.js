var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Food} = require('../models/food');
const {Centre} = require('../models/centre');
const {Classroom} = require('../models/classroom');
const {Feedback,joiSchema} = require('../models/feedback');
const auth = require('../middleware/auth');
const educator = require('../middleware/educator');


router.get('/', [auth,educator], asyncMiddleware(async function(req, res, next) {

  let foods = await Food.find({});
  let classrooms = await Classroom.find({});
  let centres = await Centre.find({});

  //To hide the Fill Out The Form link in layout bar
  let hidden = "hidden";

  res.render('feedback_form', {food_list: foods, classroom_list: classrooms, centre_list: centres, user: req.user.name, hidden});

}));

/* POST new food */
router.post('/', [auth,educator], asyncMiddleware(async function(req, res, next) {
  
  let foods = await Food.find({});
  let classrooms = await Classroom.find({});
  let centres = await Centre.find({});
  const { error } = joiSchema.validate(req.body); 
   
  if (error) return res.render('feedback_form',{
    user: req.user.name, 
    food_list: foods, 
    classroom_list: classrooms, 
    centre_list: centres, 
    valErr: error.details[0].message
  });

  let feedback = new Feedback({
    centre: req.body.centre, 
    classroom: req.body.classroom,
    date: req.body.date,
    food: req.body.food,
    numberOfChildren: req.body.numberOfChildren,
    howManyFinished: req.body.howManyFinished,
    rating: req.body.rating
  });

  feedback = await feedback.save();


  res.render('feedback_form',{
    user: req.user.name, 
    food_list: foods, 
    classroom_list: classrooms, 
    centre_list: centres
  });
}));

module.exports = router;