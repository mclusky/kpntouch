const { check, body } = require('express-validator');
const User = require('../models/user');

exports.loginValidators = [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password', 'Invalid password')
    .isLength({ min: 8 })
    .custom((value, { req }) => {
        const regex = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', 'gm');
        return regex.test(value);
    })
    .trim()
];

exports.signupValidators = [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom((value, { req }) => {
        return User.findOne({ email: value })
            .then((oldUser => {
                if (oldUser) {
                    return Promise.reject('Email already in use.');
                }
            }));
    }),
    body('password', 'Please use at least 8 alphanumeric characters for your password. ')
    .isLength({ min: 8 })
    .custom((value, { req }) => {
        const regex = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', 'gm');
        return regex.test(value);
    })
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords must match!')
        }
        return true;
    })
];

exports.groupValidators = [
    body('topic', 'This topic is not recognised')
    .isAlpha()
    .trim(),
    body('name', 'Please enter a valid group name')
    .isAlphanumeric()
    .trim(),
    body('content', 'Please enter valid content')
    .isAlphanumeric()
    .trim()
];

exports.changePasswordValidators = [
    body('password', 'Please use at least 8 alphanumeric characters for your password. ')
    .isLength({ min: 8 })
    .custom((value, { req }) => {
        const regex = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', 'gm');
        return regex.test(value);
    })
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords must match!')
        }
        return true;
    })
]