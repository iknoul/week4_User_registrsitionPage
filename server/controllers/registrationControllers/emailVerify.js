
const otpService = require('../../services/otpService');
const checkToken = require('../../middlewares/checkToken')
const mailer = require('../../utils/mailer');

const User = require('../../db/models/userSchema')

const jwt = require('jsonwebtoken')

exports.sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = otpService.generateOTP(email);
        console.log(otp, "thid is otp",email)
        await mailer.sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
        return res.status(200).send('OTP sent successfully');
    } catch (error) {
        return res.status(501).send('failed');
    }
};

exports.verifyOTP = async(req, res, next) => {
    const { email, OTP } = req.body;
     
    if (otpService.verifyOTP(email, OTP)) {
        
        const registrationToken = jwt.sign({id:23,step:"emailVerified", email:email},process.env.SECRET_KEY,{expiresIn:'1d'})
        
        // Create a new user with just the email
        try {
            const newUser = new User({ email });
            // Save the user to the database
            const savedUser = await newUser.save();

        } catch (error) {
            return res.status(202).send('Email already registered')
        }

        return res
            .status(200)
            .json({success:true, message:'email verification succesfull',registrationToken})      
            
    } else {
        return res.status(401).send('Invalid or expired OTP');
    }
};

