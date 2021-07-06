var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const { Feedback } = require('../models/feedback');
const { Food } = require('../models/food');
const { Centre } = require('../models/centre');
const { request } = require('express');
const auth = require('../middleware/auth');
const manager = require('../middleware/manager');
//const error = require('../middleware/errorMiddleware');

router.get('/', [auth,manager], asyncMiddleware(async function(req, res, next) {
    
    //aggregate for all centers' results:
    let feedbackList = await Feedback.aggregate(
        [
            {
                $lookup: {
                    from: "foods",
                    localField: "food",
                    foreignField: "_id",
                    as: "food"
                }
            },
            {
                $group: {
                    _id: "$food.name",
                    howManyFinished: {$avg : "$howManyFinished"},
                    numberOfChildren:{$avg : "$numberOfChildren"},
                    avg: {$avg: "$rating"}
                }
            },
            {
                $project : {
                    avg: {$round: ["$avg",1]},
                    consumption: {
                        $round :[{$multiply:[{$divide: [ "$howManyFinished", "$numberOfChildren" ]},100]}]
                    }
                }
            },
            { $sort : { avg : -1, consumption: -1 } }         
        ]
    );

    let centres = await Centre.find({});
    
    res.render('show_results',{title: 'Results of all centres', user: req.session.user.name, feedback_list: feedbackList, centre_list: centres});
    
}));

router.post('/', [auth,manager], asyncMiddleware( async function(req, res, next) {
    let centreId = mongoose.Types.ObjectId(req.body.centre);
    
    let feedbackList = await Feedback.aggregate(
        [
            {
                $lookup: {
                    from: "foods",
                    localField: "food",
                    foreignField: "_id",
                    as: "food"
                }
            },
            {
                $lookup: {
                    from: "centres",
                    localField: "centre",
                    foreignField: "_id",
                    as: "centre"
                }
            },
            {
                $match: {
                    "centre._id": centreId
                }
            },
            {
                $group: {
                    _id: "$food.name",
                    howManyFinished: {$avg : "$howManyFinished"},
                    numberOfChildren:{$avg : "$numberOfChildren"},
                    avg: {$avg: "$rating"}
                }
            },
            {
                $project : {
                    avg: {$round: ["$avg",1]},
                    consumption: {
                        $round :[{$multiply:[{$divide: [ "$howManyFinished", "$numberOfChildren" ]},100]}]
                    }
                }
            },
            { $sort : { avg : -1, consumption: -1 } }         
        ]
    );
    
    let centres = await Centre.find({});  
    res.render('show_results',{selectedCentreId: req.body.centre, user: req.session.user.name, feedback_list: feedbackList, centre_list: centres});
    
}));

module.exports = router;