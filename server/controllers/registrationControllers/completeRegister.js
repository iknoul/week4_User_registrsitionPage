const otpService = require('../../services/otpService');
const mailer = require('../../utils/mailer');

const User = require('../../db/models/userSchema')

const jwt = require('jsonwebtoken')

exports.submit = async (req, res, next) => {
    console.log('pppp')
    try {
        const { name, email } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Find the user by email
            {
              $set: {
                ...(name && { name }), // Update mobile number if provided
              },
            },
          );
        await mailer.sendEmail(email, 'Thank you.\nsuccessfully registerd to our platform');
        return res.status(200).send('registration completed succesfully');
    } catch (error) {
        return res.status(501).send('failed');
    }
};