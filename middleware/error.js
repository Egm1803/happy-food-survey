// const logger = require('winston');

// module.exports = function(err, req, res, next) {
    
//     //log error with winston
//     logger.error({message: err.message, level: err.level, meta: err});
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     console.log('Error middleware calisti');
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// }