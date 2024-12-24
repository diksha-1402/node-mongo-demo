import express from "express";
import authUserRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router = express.Router();

router.use("/auth", authUserRouter);
router.use("/", userRouter);

export default router;
