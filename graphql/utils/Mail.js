const AppConfig = require('../config/AppConfig');
const nodemailer = require('nodemailer');
let Mail = function () {}

Mail.prototype.sendEmail = async function (to, subject, text) {
    let transporter = nodemailer.createTransport({
      service: "Yandex",
      auth: {
          user: "lk_support@adtspb.ru",
          pass: "ZYxu8*#sxZSs"
      }
    });
    await transporter.sendMail({
      from: '"Node js" <lk_support@adtspb.ru>',
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
