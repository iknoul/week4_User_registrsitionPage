// dotenv.config({ path: './.env' });
require('dotenv').config();

const accountSid = (process.env.TWILIO_ACCOUNT_SID);
const authToken = (process.env.TWILIO_AUTH_TOKEN);
const client = require('twilio')(accountSid, authToken);

exports.sendSms=async(mobile_number, otp)=> {
    // send mail with defined transport object
    client.messages
    .create({
        body: `This is your OTP for mobile number verification. Your OTP is: ${otp}`,
        from: '+17179253837',
        to: `+91${mobile_number}`
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
  
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }