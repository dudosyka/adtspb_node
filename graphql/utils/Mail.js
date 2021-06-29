const AppConfig = require('../config/AppConfig');
const nodemailer = require('nodemailer');
let Mail = function () {}

Mail.prototype.sendEmail = async function (to, subject, text) {
    let transporter = nodemailer.createTransport({
      service: "google",
      auth: {
        user: AppConfig.email.login,
        pass: AppConfig.email.pass,
      },
    });
    await transporter.sendMail({
      from: '"Node js" <nodejs@example.com>',
      to: to,
      subject: subject,
      text: text,
  }).then(data => {
      console.log(data);
  }).catch(err => {
      console.log(err);
  });


}

Mail.prototype.sendRestoreCode = function () {

}


module.exports = Mail;
