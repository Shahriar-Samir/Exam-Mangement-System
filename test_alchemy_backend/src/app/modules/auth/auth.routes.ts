import express from "express";
import authController from "./auth.controller";
import validator from "../../util/validator";
import { logInValidator } from "./auth.validatot";
import auth from "../../middlewares/auth";
import { userRole } from "../../constents";

const authRouter = express.Router();

authRouter.post("/logIn", validator(logInValidator), authController.logIn);
authRouter.post(
  "/logOut",
  auth(userRole.examinee, userRole.candidate, userRole.admin),
  authController.logOut
);
authRouter.get("/refreshToken", authController.refreshToken);

export default authRouter;
