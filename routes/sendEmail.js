const nodemailer = require("nodemailer");
//const { options } = require("./auth");
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  secure: false,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_FROM, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

const sendEmail = async (options) => {
try{
    const mailOptions = {
        from: {
          address: process.env.EMAIL_FROM
        },
        to: options.to,
        subject: "Reset Password ✔",
        html: options.body // html body
      }; 
      await transporter.sendMail(mailOptions);
    }
    catch(err){
      console.error(err);
    }
      
}
module.exports = sendEmail;
