const { body, validationResult } = require('express-validator');

exports.validateMobile_no = [
    body('mobile_number')
    .isString()
    .notEmpty()
    .isLength({min: 10, max: 12}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateOtp = [
    body('OTP')
    .isString()
    .notEmpty()
    .isLength({min: 6, max: 6}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
