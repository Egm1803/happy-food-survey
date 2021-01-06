var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Centre,joiSchema} = require('../models/centre');
const {Classroom} = require('../models/classroom');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    let classrooms = await Classroom.find({});

    res.render('centre_form',{title: 'Add centre', classroom_list: classrooms , user: req.user.name});
}));

router.post('/', [auth,admin], asyncMiddleware( async function(req, res, next) {
    
    let classrooms = await Classroom.find({});

    const { error } = joiSchema.validate(req.body); 

    if (error) return res.render('centre_form',{title: 'Add centre', classroom_list: classrooms, user: req.user.name, valErr: error.details[0].message});
    
    let centre = new Centre({ 
        name: req.body.name,
        classroom: req.body.classroom
    });

    centre = await centre.save();

    res.render('centre_form',{title: 'Add centre', classroom_list: classrooms, centre: centre, user: req.user.name});
}));

module.exports = router;