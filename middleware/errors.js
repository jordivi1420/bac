const { stack } = require('../app');
const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            succes: false,
            error: err,
            errMessage: err.Message,
            stack: err.stack
        })

    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}
        error.message = err.message
        res.status(err.statusCode).json({
            succes: false,
            message: err.message || 'error interno'
        })
         if (err.code === 11000) {
            const message = `Entrada duplicada para ${Object.keys(err.keyValue)}`;
            error = new ErrorHandler(message, 400);
        }
        if(err.name =='JsonWebTokenError'){
            const message = 'token invalido intenta de nuevo'
            error = new ErrorHandler(message,400)
        }

        if(err.name =='TokenExpiredError'){
            const message = 'token expiro intenta de nuevo'
            error = new ErrorHandler(message,400)
        }
         if(err.name =='Error'){
            const message = `error por ${err.stack}`
            error = new ErrorHandler(message,404)
         }
         res.status(error.statusCode).json({
            succes: false,
            message: error.message || 'error interno'
            
        })

        
    }
   
    
}