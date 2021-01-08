require('express-async-errors');//alt approach to asyncMiddleware
const createError = require('http-errors');
const winston = require('winston');
require('winston-mongodb');//should be after winston
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('config');
const app = express();



//winston logger:
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // <-- for stack trace
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB({db: 'mongodb://localhost/generated-feedback-app', capped: true, metaKey: 'meta'})
  ],
  meta: true
});

// If we're not in production then log to the `console`:
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
    format: winston.format.prettyPrint(),
  }));
}
//log errors in error.log in every environment
logger.add(new winston.transports.File({filename: 'error.log'}));

// handle(log) all uncaught exceptions outside of express context
process.on('uncaughtException', (ex)=>{
  logger.error({message: ex.message, level: ex.level, meta: ex});
  process.exit(1);
});
// handle all promise rejections
process.on('unhandledRejection', (ex)=>{
  logger.error({message: ex.message, level: ex.level, meta: ex});
  process.exit(1);
});
//loggers end

//JWT
if(!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined! Exiting process...')
  process.exit(1);
};

//throw new Error('fake - something failed in startup');
//const p = Promise.reject(new Error('fake - UNHANDLED PROMISE REJECTION'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/prod')(app);


//DB connection
const db = config.get('db');
  mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log(`Connected to ${db}...`));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// ERROR HANDLER
app.use(function(err, req, res, next) {
  //log error with winston
  logger.error({message: err.message, level: err.level, meta: err});
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
