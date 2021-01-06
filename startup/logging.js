// var winston = require('winston');
// require('winston-mongodb');//should be after winston
var fs = require('fs')
var morgan = require('morgan');
var path = require('path');
//var createError = require('http-errors');

//THIS MODULE IS FOR ONLY MORGAN LOGGING FOR NOW
module.exports = function (app) {
// Morgan(request logger) file logger: create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('common', { stream: accessLogStream }));

// //winston logger:
//     let logger = winston.createLogger({
//         // level: 'info',
//         format: winston.format.combine(
//             winston.format.errors({ stack: true }), // <-- for stack trace
//             winston.format.colorize(),
//             winston.format.timestamp(),
//             winston.format.prettyPrint()
//         ),
//         defaultMeta: { service: 'user-service' },
//         transports: [
//             // - Write all logs with level `error` and below to `error.log`
//             // - Write all logs with level `info` and below to `combined.log`
//             new winston.transports.File({ filename: 'error.log', level: 'error' }),
//             new winston.transports.File({ filename: 'combined.log' }),
//             new winston.transports.MongoDB({db: 'mongodb://localhost/generated-feedback-app', capped: true, metaKey: 'meta'})
//         ],
//         meta: true
//     });
//     logger.add(new winston.transports.MongoDB({db: 'mongodb://localhost/generated-feedback-app'}));

//     // If we're not in production then log to the `console`:
//     if (process.env.NODE_ENV !== 'production') {
//         logger.add(new winston.transports.Console({format: winston.format.prettyPrint()}));
//         logger.add(new winston.transports.File({filename: 'error.log'}));
//     }
//     // handle(log) all uncaught exceptions outside of express context
//     process.on('uncaughtException', (ex)=>{
//         logger.error({message: ex.message, level: ex.level, meta: ex});
//         process.exit(1);
//     });
//     // handle all promise rejections
//     process.on('unhandledRejection', (ex)=>{
//         logger.error({message: ex.message, level: ex.level, meta: ex});
//         process.exit(1);
//     });    



    // // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //     next(createError(404));
    // });
    
    // // error handler
    // app.use(function(err, req, res, next) {
    //     //log error with winston
    //     logger.error({message: err.message, level: err.level, stack: err.stack, meta: err});
    //     // set locals, only providing error in development
    //     res.locals.message = err.message;
    //     res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    //     // render the error page
    //     res.status(err.status || 500);
    //     res.render('error');
    // });
}

