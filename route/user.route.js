import express from "express";
import { body } from "express-validator";
import { findInfo, refUserList, signIn, signUp } from "../controller/user.controller.js";
import { verifyToken } from "../model/tokenVerification.js";

const route = express.Router();
route.post("/sign-up", body("fname", "first name is not empty").notEmpty(),
    body("lname", "last name is not empty").notEmpty(),
    body("email", "email is not empty").notEmpty(),
    body("email", "incorrect email formate").isEmail(),
    body("password", "pasword have at least 4 digit").isLength({ min: 4 }),
    signUp);
route.post("/sign-in", signIn);
route.post("/referral-user-list", verifyToken, refUserList);
route.post("/show-info", verifyToken, findInfo)

export default route;