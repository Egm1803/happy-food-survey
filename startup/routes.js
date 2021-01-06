var cookieParser = require('cookie-parser');
var express = require('express');
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var foodsRouter = require('../routes/foods');
var feedbacksRouter = require('../routes/feedbacks');
var showResultsRouter = require('../routes/showResults');
var centresRouter = require('../routes/centres');
var classroomsRouter = require('../routes/classrooms');
// const error = require('../middleware/error');

module.exports = function (app) {
    // Parse JSON bodies for this app. Make sure you put
    // `app.use(express.json())` **before** your route handlers!
    app.use(express.json());
    // app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    // app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/foods', foodsRouter);
    app.use('/api/feedbacks', feedbacksRouter);
    app.use('/api/showResults', showResultsRouter);
    app.use('/api/centres', centresRouter);
    app.use('/api/classrooms', classroomsRouter);
    // app.use(error);
    
}