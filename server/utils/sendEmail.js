require('dotenv').config();
const nodemailer = require("nodemailer");

const { NODEMAILER_AUTH_EMAIL, NODEMAILER_AUTH_PASS, OTHER_NODEMAILER_AUTH_PASS } = process.env;

/**
 * 
 * @param {{fromHeader: string, subject: string, mailTo: string, mailHtml: string}} args arguments sent into the function to configure the email transport
 * @example 
 * export interface MySendEmailOptions {
    mailTo: string;
    mailHtml: string;
    fromHeader?: string;
    subject?: string;
}
 */
// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(args/*: MySendEmailOptions*/) /*: Promise<void>*/ {
  const { mailTo, mailHtml, fromHeader, subject } = args;
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log('test account', testAccount);

  // // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    //If port 587 is blocked, port 2525 makes a good alternative.
    auth: {
      user: NODEMAILER_AUTH_EMAIL, // ethereal doesn't work anymore
      pass: OTHER_NODEMAILER_AUTH_PASS, // ethereal doesn't work anymore
    },
  });
  // console.log("creating transporter", transporter);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${fromHeader} <${NODEMAILER_AUTH_EMAIL}>`, // sender address
    to: mailTo, // list of receivers
    subject: subject, // Subject line
    html: mailHtml
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {
  sendEmail
};