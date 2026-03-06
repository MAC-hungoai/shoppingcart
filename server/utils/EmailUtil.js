const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const isEmailConfigured =
  MyConstants.EMAIL_USER &&
  MyConstants.EMAIL_PASS &&
  !MyConstants.EMAIL_USER.startsWith('<') &&
  !MyConstants.EMAIL_PASS.startsWith('<');

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: MyConstants.EMAIL_SERVICE,
      auth: {
        user: MyConstants.EMAIL_USER,
        pass: MyConstants.EMAIL_PASS,
      },
    })
  : null;

const EmailUtil = {
  send(email, id, token) {
    if (!isEmailConfigured) {
      return Promise.reject(new Error('Email is not configured'));
    }

    const text =
      'Thanks for signing up, please input these informations to activate your account:\n' +
      '\t- id: ' +
      id +
      '\n' +
      '\t- token: ' +
      token;

    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text,
      };

      transporter.sendMail(mailOptions, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },
};

module.exports = EmailUtil;
