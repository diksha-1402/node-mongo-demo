import userModel from "../models/user.model.js";
import constants from "../utils/constants.js";
import emailSender from "../utils/emailSender.js";
import helper from "../utils/helper.js";
import messages from "../utils/messages.js";

let signup = async (req, res) => {
  try {
    const body = req.body;
    let uniqueCheck = await userModel.findOne({ email: body.email });

    if (uniqueCheck) {
      if (uniqueCheck.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          messages.CONST_EMAIL_NOT_VERIFIED,
          uniqueCheck.email
        );
      }
      if (uniqueCheck.firstName ==body?.firstName) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_OK,
          messages.CONST_USER_NAME_EXIST,
        );
      }
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        messages.CONST_EMAIL_UNIQUE
      );
    } else {
      let password = await helper.generatePassword();
      let hashedPassword = await helper.encryptPassword(password);

      const newUser = new userModel({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: constants.CONST_ROLE_USER,
        password: hashedPassword,
      });
      let newData = await newUser.save();
      await emailSender.sendRegistrationOtp(newData, password);
      newData.password = "";

      let data = { newData };

      return helper.returnTrueResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_SIGNUP_SUCCESS,
        data
      );
    }
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let login = async (req, res) => {
  try {
    const body = req.body;
   
    let existUser = await userModel.findOne(
      {
        firstName: body.firstName,
        role: constants.CONST_ROLE_USER,
      },
    );

    if (!existUser) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        messages.CONST_NO_RECORD_FOUND
      );
    }

    if (existUser.emailVerified == constants.CONST_USER_VERIFIED_FALSE) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_EMAIL_NOT_VERIFIED,
        existUser._id
      );
    }

    let isPasswordMatch = await helper.passwordCompare(
      body.password,
      existUser.password
    );
    if (!isPasswordMatch) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_NOT_ACCEPT,
        messages.CONST_INVALID_PASSWORD
      );
    }

    let token = await helper.jwtToken(existUser);

    existUser.password = "";
    existUser.otp = "";

    let data = { existUser, token };

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      messages.CONST_LOGIN_SUCCESS,
      data
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let changePassword = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.body.user_info._id;
    let isUserValid = await userModel.findOne({
      _id: userId,
      status: constants.CONST_STATUS_ACTIVE,
    });
    if (!isUserValid) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_NO_RECORD_FOUND
      );
    }
    const oldPassword = await helper.passwordCompare(
      body.oldPassword,
      isUserValid.password
    );
    if (!oldPassword) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_PASSWORD_MISMATCH
      );
    }
    await userModel.updateOne(
      {
        _id: userId,
      },
      {
        password: await helper.encryptPassword(body.newPassword),
      }
    );

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      messages.CONST_PASSWORD_CHANGED
    );
  } catch (error) {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error
    );
  }
};

let authUserController = {
  signup: signup,
  login: login,
  changePassword: changePassword,
};

export default authUserController;
