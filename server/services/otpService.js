const crypto = require('crypto');

const otps = {}; // Temporary in-memory store

exports.generateOTP = (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    otps[email] = { otp, expires: Date.now() + 300000 }; // OTP expires in 5 minutes
    return otp;
};

exports.verifyOTP = (email, otp) => {
    // console.log(typeof otps[email].otp,"otps",)
    console.log(otp)
    if (!otps[email]) {
        return false;
    }
    if (otps[email].expires < Date.now()) {
        console.log("now here")
        delete otps[email];
        return false;
    }
    if (otps[email].otp == otp) {
        delete otps[email];
        return true;
    }
    return false;
};
