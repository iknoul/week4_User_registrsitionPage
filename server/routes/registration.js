const express = require('express');
const router = express.Router();

const mobileVerify = require('../controllers/registrationControllers/mobileVerify')
const emailVerify = require('../controllers/registrationControllers/emailVerify')
const adharVerify = require('../controllers/registrationControllers/aadharVerify')
const checkToken = require('../middlewares/checkToken');
const validateMiddleware = require('../middlewares/validateMiddleware');
const panCardVerify = require('../controllers/registrationControllers/panCardVerify')
const bankAccountVerify = require('../controllers/registrationControllers/verifyBankAccount')
const gstAccountVerify = require('../controllers/registrationControllers/gstVerification')
const pinCodeFetch = require('../controllers/registrationControllers/pinCodeDataFetch')
const completeRegister = require('../controllers/registrationControllers/completeRegister')


router.post('/verify-sentotp-email', validateMiddleware.validateEmail, emailVerify.sendOTP);
router.post('/verify-verifyotp-email', validateMiddleware.validateOtp, emailVerify.verifyOTP);
router.post('/verify-sentotp-mobile', validateMiddleware.validateMobile_no, checkToken.checkToken(['emailVerified']), mobileVerify.sendOTPMobile);
router.post('/verify-verifyotp-mobile', validateMiddleware.validateOtp, checkToken.checkToken(['emailVerified']), mobileVerify.verifyOTPMobile);
router.post('/verify-aadhar', checkToken.checkToken(['mobileVerified']), adharVerify.handleAadhaarValidation)
router.post('/verify-pancard',checkToken.checkToken(['mobileVerified']), panCardVerify.verifyPanToAadhaar)
router.post('/verify-accNo',checkToken.checkToken(['mobileVerified']), bankAccountVerify.verifyBankDetails)
router.post('/verify-gst',checkToken.checkToken(['mobileVerified']), gstAccountVerify.verifyGST)
router.post('/verify-pinCode',checkToken.checkToken(['mobileVerified']), pinCodeFetch.getPincodeData)
router.post('/verify-submit',checkToken.checkToken(['mobileVerified']), completeRegister.submit)


module.exports = router;