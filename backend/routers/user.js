const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { loginValidators, signupValidators, changePasswordValidators } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.post('/signup', signupValidators, userController.createUser);

router.post('/login', loginValidators, userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

router.post('/forgot', userController.forgot);

router.post('/reset-password', changePasswordValidators, userController.resetPassword);

router.get('/reset/:token', userController.reset);

router.post('/group-joined', auth, userController.joinGroup);

router.get('/groups-joined', auth, userController.getGroupsJoined);

router.patch('/leave-group', auth, userController.leaveGroup);

module.exports = router;