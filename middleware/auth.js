const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ErrorHandler = require("../utils/errorHandler");
const CatchingAsyncErrors = require("./CatchingAsyncErrors");

exports.isAuthenticatedUser = CatchingAsyncErrors (async (req,res,next)=>{
    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler('inicia sesion primero',401))

    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})

exports.authorizeRoles = (...roles)=>{
    
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`rol ${req.user.role} no esta autorizado para acceder`,403))

        }
        next()
    }
}


