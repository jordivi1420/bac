const express = require('express')
const router = express.Router();

const {getProducts,newProduct,getSingleProduct,updateProduct,deleteProduct,
    createProductComentReview,getReviews,deleteReview,getAdminProducts} = require('../controllers/productControllers');
const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')

router.route('/products').get(getProducts)
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/product/admin/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)
router.route('/product/admin/:id')
.put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

router.route('/review').put(isAuthenticatedUser,createProductComentReview)
router.route('/reviews').get(isAuthenticatedUser,getReviews)
router.route('/reviews').delete(isAuthenticatedUser,deleteReview)
module.exports = router;

