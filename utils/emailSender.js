
import nodemailer from "nodemailer";
import pug from "pug";
import constants from "./constants.js";
import messages from "./messages.js";

const sendEmail = async (name, email, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: constants.CONST_SMTP_HOST,
    port: constants.CONST_SMTP_PORT,
    secure: true,
    auth: {
      user: constants.CONST_SMTP_USER,
      pass: constants.CONST_SMTP_PASSWORD,
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const info = await transporter.sendMail({
    from: `${constants.CONST_APP_NAME} <${constants.CONST_SMTP_FROM_ADDRESS}>`,
    to: email,
    subject: subject,
    html: message,
  });
  console.log("Message sent: %s", info.messageId);
};

const sendRegistrationOtp = async (userData, password) => {
  let templateDir = "templates/";
  let messageBody = pug.renderFile(`${templateDir}registrationEmail.pug`, {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    password: password,
  });
  let subject =messages.CONST_REGISTRATION_EMAIL;
  await sendEmail(userData.name, userData.email, subject, messageBody);
  return true;
};

const emailSender = {
  sendRegistrationOtp: sendRegistrationOtp
};

export default emailSender;
