const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig.helper');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: "Intership Project", 
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
