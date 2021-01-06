module.exports = function (handler) {
    //https://codewithmosh.com/courses/293204/lectures/4510581
    return async (req, res, next) => {
        try{
            await handler(req,res);
        }
        catch(ex) {
            //call Error Middleware
            next(ex)
        }
    }
    
}