const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "kkumarannait@gmail.com",
      pass: "seku dbyd xxvt gpqg",
    },
  });
  exports.sendEmail=async(email, sub, text)=> {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'kkumarannait@gmail.com', // sender address
      to: email, // list of receivers
      subject: sub, // Subject line
      text: text, // plain text body
       // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }