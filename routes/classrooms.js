var express = require('express');
var router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {Classroom, joiSchema} = require('../models/classroom');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    res.render('classroom_form',{title: 'Add Classroom', user: req.session.user.name});
    
}));

router.post('/', [auth,admin], asyncMiddleware(async function(req, res, next) {

    const { error } = joiSchema.validate(req.body); 

    if (error) return res.render('classroom_form',{title: 'Add classroom', user: req.session.user.name, valErr: error.details[0].message});

    let classroom = new Classroom({ 
        name: req.body.name
    });
    classroom = await classroom.save();
     
    res.render('classroom_form',{title: 'Add classroom', classroom: classroom.name, user: req.session.user.name});
}));

module.exports = router;