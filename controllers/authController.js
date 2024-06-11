const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');
const sendToken = require('../utils/jwtToken');
const CatchingAsyncErrors = require('../middleware/CatchingAsyncErrors');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const cloudinary = require('cloudinary')
//api/v1/register
exports.registerUser = catchAsyncErrors (async (req,res,next)=>{
    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'avatar',
        width: 150,
        crop: "scale"
    })
    const {nombre,email,password} =  req.body;
    const user = await User.create({
        nombre,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user,200,res)
})

exports.getProfileUser = catchAsyncErrors (async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

exports.loginUser = catchAsyncErrors (async (req,res,next) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler('por favor ingrese su email y contraseña',400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler('email invalido o contraseña',401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched){
        return next(new ErrorHandler('email invalido o contraseña',401))
    }
    sendToken(user,200,res)
})

//actualizar contraseña 

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')
    const isMached = await user.comparePassword(req.body.oldPassword)
    if(!isMached){
        return next(new ErrorHandler('la contraseña anterior es inccorrecta',400))
    }
    user.password = req.body.password
    await user.save()
    sendToken(user,200,res)
})

//olvidastes contraseña? api/v1/pasword/forgot
exports.forgotPassword = catchAsyncErrors (async (req,res,next) =>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler(`el correo ${user} no ha sido encontrado con este correo`,404))
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message = `su token de restablecimiento es el siguiente:\n\n${resetUrl}
    \n No has solicitado este correo electrónico, entonces ignóralo.`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'maicao_libre recuperacion contraseña',
            message
        })
        res.status(200).json({
            success: true,
            message: `email enviado a: ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken  = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message,500))
    }
})

//reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now() }
    })
    if(!user){
        return next(new ErrorHandler('token invalido o ya el token expiro ',400))
    }
    if(req.body.password !==req.body.confirmPassword){
        return next(new ErrorHandler('la contraseña no coincide ',400))
    }
    user.password = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user,200,res)
})
//update user profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
        nombre: req.body.nombre,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//logaut
exports.logout = CatchingAsyncErrors(async(req,res,next) =>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'logout completo'
    })
})

//obtener todos los usuarios registrados
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.find()
    res.status(200).json({
        success: true,
        user
    })
})

exports.getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        next(new ErrorHandler(`este usuario ${req.params.id} no se encuentra registrado en la base de datos`))
    }
    res.status(200).json({
        success: true,
        user
    })
})

exports.updateAdminUser = catchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
        nombre: req.body.nombre,
        email: req.body.email,
        role: req.body.role
    }

    if (req.body.avatar !== "" && req.body.avatar !== undefined){
        const user = await User.findById(req.user.id);
        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: 'avatar',
            width: 150,
            crop: "scale"
        })
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }

    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        next(new ErrorHandler(`este usuario ${req.params.id} no se encuentra registrado en la base de datos`))
    }

    await user.remove()
    res.status(200).json({
        success: true,
    })
})
