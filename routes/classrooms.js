var express = require('express');
var router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Classroom, joiSchema} = require('../models/classroom');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    let classrooms = await Classroom.find({});
    res.render('classroom_form',{classrooms, user: req.session.user.name});
    
}));

router.post('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 

    if (error) return res.render('classroom_form',{ valErr: error.details[0].message});

    let classroom = new Classroom({ 
        name: req.body.name
    });
    classroom = await classroom.save();
     
    res.render('classroom_form',{ classroom: classroom.name, user: req.session.user.name});
}));

//Get edit classroom screen
router.get('/:_id', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {
  
    //get all classrooms from DB and sort by week and day

    let classroomToEdit = await Classroom.findOne({_id: req.params._id});
    if (!classroomToEdit) return res.render('classroom_form',{ classroomToEdit });
    let classrooms = await Classroom.find({});
    res.render('classroom_form',{ classrooms, classroomToEdit, user: req.session.user.name});
    
}));

//Delete classroom
router.get('/:_id/delete', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {

    await Classroom.deleteOne({_id: req.params._id});
    let classrooms = await Classroom.find({});
    res.render('centre_form',{ classrooms , user: req.session.user.name,});
    
}));

module.exports = router;