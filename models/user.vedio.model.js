import mongoose from "mongoose";
import constants from "../utils/constants.js";

const userVedioSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    vedioUrl: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
    collection: "userVedio",
    versionKey: false,
  }
);

const userVedioModel = mongoose.model("userVedioSchema", userVedioSchema);

export default userVedioModel;
