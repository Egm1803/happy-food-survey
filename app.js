require('express-async-errors');//alt approach to asyncMiddleware
const createError = require('http-errors');
const winston = require('winston');
require('winston-mongodb');//should be after winston
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('config');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const helpers = require('./helpers');

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
    //new winston.transports.MongoDB({db: config.get('db'), capped: true, metaKey: 'meta'})
  ],
  meta: true
});

//log errors to the `console`:
logger.add(new winston.transports.Console({format: winston.format.prettyPrint()}));
//log errors in error.log in every environment
logger.add(new winston.transports.File({filename: 'error.log'}));
//log in to db
logger.add(new winston.transports.MongoDB({db: config.get('db'), capped: true, metaKey: 'meta'}));

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

// check session secret
if(!config.get('sessionSecret')) {
  console.log('FATAL ERROR: sessionSecret is not defined! Exiting process...');
  logger.log('FATAL ERROR: sessionSecret is not defined! Exiting process...');
  process.exit(1);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//create and store sessions in DB
const store = new MongoDBStore({
  uri: config.get('db'),
  collection: 'mySessions'
});

app.use(session({
  key: 'my_session',
  secret: config.get('sessionSecret'),
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000,//60 DAYS
      httpOnly: true,
      secure: false 
  },
  store: store
}));

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  // res.locals.flashes = req.flash();
  res.locals.user = req.session.user.name || null;
  res.locals.currentPath = req.path;
  next();
});

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/prod')(app);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, he cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.my_session && !req.session.user) {
      res.clearCookie('my_session');        
  }
  next();
});


//DB connection
const db = config.get('db');
  mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log(`Connected to ${db}...`));


// FIX 404 ERROR HANDLING
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// ERROR HANDLER

app.use(function(err, req, res, next) {
  //log error with winston
  logger.error({message: err.message, level: err.level, meta: err});
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page in development etc., error_redirect page in production.
  if (app.get('env') === 'production') {
    res.render('error_redirect');
  } else {
    res.status(err.status || 500);
  }
});

module.exports = app;
