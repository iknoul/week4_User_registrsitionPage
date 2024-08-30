const otpService = require('../../services/otpService');
const userVerification = require('../../services/userVerification')
const checkToken = require('../../middlewares/checkToken')
const mailer = require('../../utils/mailer');
const twilio = require('../../utils/twilio')
const whatsapp = require('../../utils/whatsapp')
// const { auth } = require('./../../config/firebaseConfig'); // Import the auth object from firebaseConfig.js
const jwt = require('jsonwebtoken')

exports.sendOTP = async (req, res, next) => {
    const position = userVerification.verifyUser(req.body.Mobile_no)
    if(position){ 
        try {
            const { email } = req.body;
            const otp = otpService.generateOTP(email);
            console.log(otp, "thid is otp",email)
            // await mailer.sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
            return res.status(200).send('OTP sent successfully');
        } catch (error) {
            return res.status(501).send('failed');
        }
    }
    else{
        return res.status(401).send('Invalid User number');
    }
};

exports.verifyOTP = (req, res, next) => {
    const { email, OTP } = req.body;
     
    if (otpService.verifyOTP(email, OTP)) {
        const registrationToken = jwt.sign({id:23,step:"emailVerified"},process.env.SECRET_KEY,{expiresIn:'1d'})
       return res
        .status(200)
        .json({success:true, message:'login succesfull',registrationToken})      
            
    } else {
        return res.status(401).send('Invalid or expired OTP');
    }
};

exports.sendOTPMobile = async (req, res, next) => {
    
    const position = userVerification.verifyUser(req.body.Mobile_no)
    if(position){ 
        try {
            const { mobile_number } = req.body;
            const otp = otpService.generateOTP(mobile_number);
            console.log(otp, "thid is otp",mobile_number)
            // await whatsapp.sendMsg(mobile_number, `Your OTP Code: \nYour OTP code is ${otp}`);
            // await twilio.sendSms(mobile_number, otp)
            return res.status(200).send('OTP sent successfully');
        } catch (error) {
            return res.status(501).send('failed');
        }
    }
    else{
        return res.status(401).send('Invalid User number');
    }
};
exports.verifyOTPMobile = (req, res, next) => {
    const { mobile_number, OTP } = req.body;
     
    if (otpService.verifyOTP(mobile_number, OTP)) {
        const registrationToken = jwt.sign({id:23,step:" "},process.env.SECRET_KEY,{expiresIn:'1d'})
       return res
        .status(200)
        .json({success:true, message:'login succesfull',registrationToken})      
            
    } else {
        return res.status(401).send('Invalid or expired OTP');
    }
};

exports.logout = (req, res) => {
    const bToken = req.headers.authorization
    checkToken.blacklistedTokens.add(bToken);
    res.status(200).json({ message: 'Logged out successfully' });
};
