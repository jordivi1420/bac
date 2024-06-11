const express = require('express')
const router = express.Router();

const {proccesPayment,sendStripeApi} = require('../controllers/paymentController')
const {isAuthenticatedUser} = require('../middleware/auth')

router.route('/payment/procces').post(isAuthenticatedUser,proccesPayment);
router.route('/stripeapi').get(isAuthenticatedUser,sendStripeApi);

module.exports = router;