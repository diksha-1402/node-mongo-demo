import userModel from "../models/user.model.js";
import userVedioModel from "../models/user.vedio.model.js";
import constants from "../utils/constants.js";
import emailSender from "../utils/emailSender.js";
import helper from "../utils/helper.js";
import messages from "../utils/messages.js";

let getProfile = async (req, res) => {
  try {
    const userDetail = await userModel.aggregate([
      {
        $match: {
          _id: req.body.user_info._id,
          status: constants.CONST_STATUS_ACTIVE,
        },
      },
      {
        $lookup: {
          from: "userVedio",
          localField: "_id",
          foreignField: "userId",
          as: "userVedioData",
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          about: 1,
          status: 1,
          createdAt: 1,
          role: 1,
          phoneNumber: 1,
          userVedioData: 1,
        },
      },
    ]);

    if (userDetail.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_NO_RECORD_FOUND
      );
    }

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_NOT_FOUND,
      messages.CONST_USER_PROFILE,
      userDetail[0]
    );
  } catch (error) {
    console.log(error);
    return helper.returnFalseResponse(
      req,
      res,
      constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

let updateProfile = async (req, res) => {
  try {
    let userId = req.body.user_info._id;
    let body = req.body;

    let userData = await userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      { ...body },
      { new: true }
    );
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
        messages.CONST_NO_RECORD_FOUND
      );
    }

    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      messages.CONST_PROFILE_UPDATED
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

let uploadVedio = async (req, res) => {
  try {
    console.log(req.file?.location,"----------file")
    const vedio =
      req.file?.location !== undefined ? `${req.file.location}` : "";
    let userData = await userVedioModel.create({
      vedioUrl: vedio,
      title: req.body?.title,
      description: req.body?.description,
      userId: req.body.user_info._id,
    });
    console.log(userData,"---------user")
    if (!userData) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_WRONG
      );
    }
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      messages.CONST_VEDIO_UPLOADED
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

let userListing = async (req, res) => {
  try {
    let pipeline = [
      {
        $match: {
          status: constants.CONST_STATUS_ACTIVE,
        },
      },
      {
        $lookup: {
          from: "userVedio",
          localField: "_id",
          foreignField: "userId",
          as: "userVedioData",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          about: 1,
          status: 1,
          createdAt: 1,
          role: 1,
          phoneNumber: 1,
          userVedioData: 1,
        },
      },
    ];

    if (req.query?.page) {
      const page = parseInt(req.query?.page);
      const limit = constants.CONST_LIMIT;
      const skip = (page - 1) * limit;
      pipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );
    }
    const userDetail = await userModel.aggregate(pipeline);
    if (userDetail.length == 0) {
      return helper.returnFalseResponse(
        req,
        res,
        constants.CONST_RESP_CODE_OK,
        messages.CONST_NO_RECORD_FOUND
      );
    }
    if (req.query?.page) {
      pipeline.pop();
      pipeline.pop();
    }
    const userCount = await userModel.aggregate(pipeline);
    return helper.returnTrueResponse(
      req,
      res,
      constants.CONST_RESP_CODE_OK,
      messages.CONST_USER_LISTING,
      userDetail,
      userCount.length
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

let userController = {
  getProfile: getProfile,
  updateProfile: updateProfile,
  uploadVedio: uploadVedio,
  userListing: userListing,
};

export default userController;
