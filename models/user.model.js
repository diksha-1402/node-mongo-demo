import mongoose from "mongoose";
import constants from "../utils/constants.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      maxLength: 100,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      maxLength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      enum: [
        constants.CONST_USER_VERIFIED_TRUE,
        constants.CONST_USER_VERIFIED_FALSE,
      ],
      default: constants.CONST_USER_VERIFIED_TRUE,
    },
    role: {
      type: Number,
      enum: [constants.CONST_ROLE_USER, constants.CONST_ROLE_ADMIN],
      comment: "1: Admin, 2: User",
    },
    status: {
      type: String,
      enum: [
        constants.CONST_STATUS_ACTIVE,
        constants.CONST_STATUS_INACTIVE,
        constants.CONST_STATUS_DELETED,
      ],
      default: constants.CONST_STATUS_ACTIVE,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const userModel = mongoose.model("userSchema", userSchema);

export default userModel;
