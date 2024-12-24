import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import helper from "./helper.js";
import constants from "./constants.js";

const joiPassword = Joi.extend(joiPasswordExtendCore);
let message =
  "Password Should be at least 8 characters long and includes at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character. Avoid using spaces.";
let joiSignUpValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The last name should consist of only alphabetic characters.",
      }),

    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone digit must be a 10-digit numeric value",
      }),

    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiLoginValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    password: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiChangePasswordValidator = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),

    newPassword: joiPassword
      .string()
      .messages({
        "string.empty": message,
      })
      .minOfLowercase(1)
      .messages({
        "password.minOfLowercase": message,
      })
      .minOfNumeric(1)
      .messages({
        "password.minOfNumeric": message,
      })
      .minOfUppercase(1)
      .messages({
        "password.minOfUppercase": message,
      })
      .minOfSpecialCharacters(1)
      .messages({
        "password.minOfSpecialCharacters": message,
      })
      .noWhiteSpaces()
      .messages({
        "password.noWhiteSpaces": message,
      })
      .min(8)
      .messages({
        "string.min": message,
      })
      .required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Password and confirm password not matched",
      }),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUpdateProfileValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.pattern.base":
          "The first name should consist of only alphabetic characters.",
      }),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .optional()
      .messages({
        "string.pattern.base":
          "The last name should consist of only alphabetic characters.",
      }),
    phoneNumber: Joi.string()
      .allow("", null)
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone digit must be a 10-digit numeric value",
      }),

    user_info: Joi.object().optional(),
    about: Joi.string().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let joiUploadVedioValidator = async (req, res, next) => {
  const body = req.body;
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    vedio: Joi.string().optional(),
    user_info: Joi.object().optional(),
  });

  const { error, value } = schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    const errors = await helper.joiValidationErrorConvertor(error.details);
    await helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_ACCEPT,
      errors,
      {}
    );
  } else {
    next();
  }
};

let commonValidator = {
  joiSignUpValidator: joiSignUpValidator,
  joiLoginValidator: joiLoginValidator,
  joiChangePasswordValidator: joiChangePasswordValidator,
  joiUpdateProfileValidator: joiUpdateProfileValidator,
  joiUploadVedioValidator: joiUploadVedioValidator,
};

export default commonValidator;
