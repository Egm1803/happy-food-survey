var fs = require('fs')
var morgan = require('morgan');
var path = require('path');

//THIS MODULE IS FOR ONLY LOOGING OF MORGAN
module.exports = function (app) {
// Morgan(request logger) file logger: create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('common', { stream: accessLogStream }));
}

