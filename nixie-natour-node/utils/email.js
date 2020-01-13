// Created by CunjunWang on 2020/1/13

const mailer = require('nodemailer');
const catchAsync = require('./../utils/catchAsync');

const sendEmail = async options => {
  // 1. create a transporter
  const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2. define the email options
  const mailOptions = {
    from: 'Cunjun Wang <duckwcj@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3. send the email with mailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
