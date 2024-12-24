import constants from "./constants.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import moment from "moment";
import jwt from "jsonwebtoken";





const checkEmailUser = async (email) => {
  let userData = await userModel.findOne({
    email: email,
  });
  var message;
  if (userData) {
    if (userData.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
      let otpData = await helper.generateOtp();
      await userModel.updateMany(
        { email: email },
        {
          otp: otpData.randomOtp,
          otpExpiry: otpData.expirationTime,
          otpType: constants.CONST_REGISTER_OTP,
        },
        {
          new: true,
        }
      );
      return { newData: userData, otpData: otpData };
    } else if (
      userData.isAccountVerified == constants.CONST_USER_VERIFIED_FALSE
    ) {
      return (message =
        "lang_you_are_exist_but_not_verified_by_admin_please_wait");
    } else {
      return (message = "lang_email_already_exist");
    }
  }
  return message;
};

const generateOtp = async () => {
  const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
  const currentTime = new Date();
  const expirationTime = new Date(
    currentTime.getTime() + 10 * 60 * 1000
  ).toISOString();
  let result = {
    randomOtp: randomOtp,
    expirationTime: expirationTime,
  };
  return result;
};

const passwordCompare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(constants.CONST_GEN_SALT);
  password = await bcrypt.hash(password, salt);
  return password;
};

const getAdminDetails = async () => {
  return await userModel.findOne({ role: constants.CONST_ROLE_ADMIN });
};

const removeBackSlashes = (value) => {
  return value.replace(/\//g, "");
};


const returnTrueResponse = async (
  req,
  res,
  statusCode,
  message,
  arr,
  totalCounts,
  unreadCount
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 1,
    message: message,
    data: arr,
    totalCounts: totalCounts,
    unreadCount: unreadCount,
  });
};

const returnFalseResponse = (
  req,
  res,
  statusCode,
  message,
  arr,
  error_code
) => {
  return res.status(statusCode).json({
    version: {
      current_version: constants.CONST_APP_VERSION,
      major_update: 0,
      minor_update: 0,
      message: "App is Up to date",
    },
    success: 0,
    message: message,
    data: arr,
    error_code: error_code,
  });
};

const validationErrorConverter = (logs) => {
  let error;
  for (let i = 0; i <= Object.values(logs.errors).length; i++) {
    error = Object.values(logs.errors)[0].message;
    break;
  }
  return error;
};

const joiValidationErrorConvertor = async (errors) => {
  let error_message = "";
  errors.forEach((element, index) => {
    error_message = element.message;
    return true;
  });
  error_message = error_message.replaceAll("/", " ");
  error_message = error_message.replaceAll("_", " ");
  return error_message;
};

const jwtToken = async (userData) => {
  const secretKey = process.env.JWT_TOKEN_KEY;
  const user = {
    id: userData._id,
    email: userData.email,
    role: userData.role,
  };
  const token = jwt.sign(user, secretKey);
  return token;
};

const generatePassword = async () => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = "@#$%&*_";
  const numbers = "0123456789";
  const allCharacters =
    uppercaseLetters + specialCharacters + numbers + lowercaseLetters;
  const randomUppercase =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomLowercase =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomSpecial =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  let randomString = "";
  for (let i = 0; i < 5; i++) {
    randomString +=
      allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  const password =
    randomUppercase +
    randomSpecial +
    randomNumber +
    randomString +
    randomLowercase;

  return password;
};


let helper = {
  passwordCompare: passwordCompare,
  encryptPassword: encryptPassword,
  removeBackSlashes: removeBackSlashes,
  returnTrueResponse: returnTrueResponse,
  returnFalseResponse: returnFalseResponse,
  validationErrorConverter: validationErrorConverter,
  joiValidationErrorConvertor: joiValidationErrorConvertor,
  checkEmailUser: checkEmailUser,
  generateOtp: generateOtp,
  jwtToken: jwtToken,
  getAdminDetails: getAdminDetails,
 
  generatePassword:generatePassword,
 
};

export default helper;
