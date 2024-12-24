import jwt from "jsonwebtoken";
import constants from "../utils/constants.js";
import mongoose from "mongoose";
import helper from "../utils/helper.js";

import userModel from "../models/user.model.js";
import messages from "../utils/messages.js";

let checkAuthToken = async (req, res, next) => {
  const headerContent = req.headers;
  if (headerContent.hasOwnProperty("x-authorization")) {
    const getAuthToken = headerContent["x-authorization"];

    if (!getAuthToken.includes("Bearer")) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_UNAUTHORIZED,
        messages.CONST_INVALID_TOKEN
      );
    }

    try {
      const parts = getAuthToken.split(" ");
      if (parts.length !== 2) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          messages.CONST_INVALID_TOKEN
        );
      }
      const scheme = parts[0];
      const token = parts[1];
      if (!/^Bearer$/i.test(scheme)) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          messages.CONST_INVALID_TOKEN
        );
      }
      const tokenPayload = jwt.decode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (tokenPayload?.exp < currentTimestamp) {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          messages.CONST_TOKEN_EXPIRED,
          {},
          461
        );
      }
      const decodeToken = jwt.verify(token, constants.CONST_JWT_TOKEN_KEY);

      if (
        decodeToken.hasOwnProperty("id") &&
        decodeToken.hasOwnProperty("email")
      ) {
        let userInfo = await userModel
          .findOne({
            _id: new mongoose.Types.ObjectId(decodeToken.id),
          })
          .select("_id firstName lastName email status");
        if (!userInfo) {
          return helper.returnFalseResponse(
            req,
            res,
            constants.CONST_RESP_CODE_UNAUTHORIZED,
            messages.CONST_NO_RECORD_FOUND,
            {},
            461
          );
        }

        if (userInfo.status == constants.CONST_STATUS_DELETED) {
          return helper.returnFalseResponse(
            req,
            res,
            constants.CONST_RESP_CODE_UNAUTHORIZED,
            messages.CONST_ACCOUNT_DELETED,
            {},
            461
          );
        }

        req.body.user_info = userInfo;
        next();
      } else {
        return helper.returnFalseResponse(
          req,
          res,
          constants.CONST_RESP_CODE_UNAUTHORIZED,
          messages.CONST_INVALID_TOKEN,
          {}
        );
      }
    } catch (e) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        e.message,
        {}
      );
    }
  } else {
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_UNAUTHORIZED,
      messages.CONST_INVALID_TOKEN
    );
  }
};

let AuthMiddleware = {
  checkAuthToken: checkAuthToken,
};

export default AuthMiddleware;
