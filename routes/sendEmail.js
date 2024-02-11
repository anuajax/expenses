const nodemailer = require("nodemailer");
const { options } = require("./auth");

const sendEmail = (options) => {

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });
    const mailOptions = {
        from: process.env.EMAIL_FROM, 
        to: options.to,
        subject: "Reset Password ✔",
        html: options.body // html body
      };
      transporter.sendMail(mailOptions, (err, info)=>{
        if(err) alert("Message sent: %s", response.messageId);
        else alert("Mail could not be sent");
      });
      
}
module.exports = sendEmail;
