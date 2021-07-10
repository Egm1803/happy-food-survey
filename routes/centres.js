var express = require('express');
var router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Centre,joiSchema} = require('../models/centre');
const {Classroom} = require('../models/classroom');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    let classrooms = await Classroom.find({});
    let centres = await Centre.find({});
    res.render('centre_form',{centres, classroom_list: classrooms , user: req.session.user.name});
}));

router.post('/', [auth,admin], asyncMiddleware( async function(req, res, next) {
    
    let classrooms = await Classroom.find({});

    const { error } = joiSchema.validate(req.body); 

    if (error) return res.render('centre_form',{title: 'Add centre', classroom_list: classrooms, user: req.session.user.name, valErr: error.details[0].message});
    
    let centre = new Centre({ 
        name: req.body.name,
        classroom: req.body.classroom
    });

    centre = await centre.save();
    let centres = await Centre.find({});
    res.render('centre_form',{classroom_list: classrooms, centres, centre, user: req.session.user.name});
}));

//Delete centre
router.get('/:_id/delete', [auth,admin,validateObjectId], asyncMiddleware(async function(req, res, next) {

    await Centre.deleteOne({_id: req.params._id});
    let classrooms = await Classroom.find({});
    let centres = await Centre.find({});
    res.render('centre_form',{ centres, classroom_list: classrooms , user: req.session.user.name,});
    
}));

module.exports = router;