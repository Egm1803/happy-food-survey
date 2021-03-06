var express = require('express');
var router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Classroom, joiSchema} = require('../models/classroom');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    let classrooms = await Classroom.find({});
    res.render( 'classroom_form',{title: 'Add new classroom', classrooms, user: req.session.user.name});
    
}));

router.post('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 

    if (error) return res.render('classroom_form',{title: 'Add new classroom',  valErr: error.details[0].message});

    let classroom = new Classroom({ 
        name: req.body.name
    });
    classroom = await classroom.save();
    
    let classrooms = await Classroom.find({});

    res.render('classroom_form',{title: 'Add new classroom', classroom: classroom.name,classrooms, user: req.session.user.name});
}));

//Get edit classroom screen
router.get('/:_id', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {
  
    //get all classrooms from DB and sort by week and day

    let classroomToEdit = await Classroom.findOne({_id: req.params._id});
    if (!classroomToEdit) return res.render('classroom_form',{ classroomToEdit });
    let classrooms = await Classroom.find({});
    res.render('classroom_form',{title: 'Edit classroom', classrooms, classroomToEdit, user: req.session.user.name});
    
}));

router.post('/:_id', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 
    if (error) return res.render('classroom_form',{ title: 'Add new classroom', valErr: error.details[0].message});

    const updatedClassroom = await Classroom.findOneAndUpdate({_id:req.params._id}, req.body, {new: true, useFindAndModify: true}).exec();
    
    if (!updatedClassroom) return res.render('classroom_form',{title: 'Add new classroom', classrooms, valErr: "Can't find the classroom you are looking for." });
    
    let classrooms = await Classroom.find({});

    res.render('classroom_form',{ title: 'Add new classroom', classroom: updatedClassroom, classrooms });

}));

//Delete classroom
router.get('/:_id/delete', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {

    await Classroom.deleteOne({_id: req.params._id});
    let classrooms = await Classroom.find({});
    res.render('classroom_form',{title: 'Add new classroom',  classrooms , user: req.session.user.name,});
    
}));

module.exports = router;