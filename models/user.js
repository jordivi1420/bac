const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor, proporciona tu nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor, proporciona tu correo electrónico'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Por favor, proporciona una contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    role: {
        type: String,
        default: 'user'
    },
    avatar: {
      public_id:{
        type: String,
        required: true
      },
      url:{
        type: String,
        required: true
      }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//encriptacion de la contraseña para no perder con el profe ricardo 
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')){
    next()
  }
  this.password = await bcrypt.hash(this.password,10)
})

//retorno por medio del jwt token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({id: this._id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
  
}
userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

//restablecer contraseña
userSchema.methods.getResetPasswordToken = function (){
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //llevar para que el token expire
  this.resetPasswordExpire = Date.now() + 30*60*1000

  return resetToken
}
module.exports = mongoose.model('User',userSchema);