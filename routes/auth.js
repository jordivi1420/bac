const express = require('express')
const router = express.Router();

const {registerUser,loginUser,logout,forgotPassword,resetPassword,getProfileUser,updatePassword,
    updateProfile,getAllUsers,getUser,updateAdminUser,deleteUser} = require('../controllers/authController');
const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')
router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword);
router.route('/profile').get(isAuthenticatedUser,getProfileUser)
router.route('/update/password').put(isAuthenticatedUser,updatePassword)
router.route('/profile/update').put(isAuthenticatedUser,updateProfile)
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUser)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateAdminUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
module.exports = router;