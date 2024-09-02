
const otpService = require('../../services/otpService');
const twilio = require('../../utils/twilio')
const whatsapp = require('../../utils/whatsapp')
// const { auth } = require('./../../config/firebaseConfig'); // Import the auth object from firebaseConfig.js

const jwt = require('jsonwebtoken')
const User = require('../../db/models/userSchema')


exports.sendOTPMobile = async (req, res, next) => { 

    try {
        const { mobile_number } = req.body;
        const otp = otpService.generateOTP(mobile_number);
        console.log(otp, "thid is otp",mobile_number)
        // await whatsapp.sendMsg(mobile_number, `Your OTP Code: \nYour OTP code is ${otp}`);
        await twilio.sendSms(mobile_number, otp)
        return res.status(200).send('OTP sent successfully');
    } catch (error) {
        return res.status(501).send('failed');
    }
   
};

exports.verifyOTPMobile = async(req, res, next) => {
    const { mobile_number, OTP, email } = req.body;
     
    if (otpService.verifyOTP(mobile_number, OTP)) {
        const registrationToken = jwt.sign({id:23,step:"mobileVerified", email},process.env.SECRET_KEY,{expiresIn:'1d'})
       
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Find the user by email
            {
              $set: {
                ...(mobile_number && { mobile_number }), // Update mobile number if provided
              },
            },
          );

        return res
            .status(200)
            .json({success:true, message:'mobile verification succesfull',registrationToken})      
            
    } else {
        return res.status(401).send('Invalid or expired OTP');
    }
};