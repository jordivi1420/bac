const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
const cloudinary = require('cloudinary')
const ErrorMiddleware = require('./middleware/errors')
const product = require('./routes/product')
const payment = require('./routes/payment')
const dotenv = require('dotenv');
const auth = require('./routes/auth')
const order = require('./routes/order')
// Cargar variables de entorno
dotenv.config({ path: 'config/config.env' });
app.use(express.json())
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: true}))

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
console.log('secret de stripe', process.env.STRIPE_SECRET_KEY);

app.use('/api/v1',product)
app.use('/api/v1',auth)
app.use('/api/v1',order)
app.use('/api/v1',payment)
app.use(ErrorMiddleware)
//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})
module.exports = app