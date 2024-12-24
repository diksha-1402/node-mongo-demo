import contentUpload from "../middleware/contentUpload.js";
import commonValidator from "../utils/validation.js";
import authUserController from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
const authUserRouter = express.Router();

authUserRouter.post(
  "/signup",
  commonValidator.joiSignUpValidator,
  authUserController.signup
);

authUserRouter.post(
  "/login",
  commonValidator.joiLoginValidator,
  authUserController.login
);

authUserRouter.patch(
  "/change-password",
  authMiddleware.checkAuthToken,
  commonValidator.joiChangePasswordValidator,
  authUserController.changePassword
);


export default authUserRouter;
