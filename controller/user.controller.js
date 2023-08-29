import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Info } from "../model/exInfo.model.js";
import mongoose from "mongoose";

export const signUp = async (request, response, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let tokenNo = 100;
        let error = await validationResult(request);
        if (!error)
            response.status(404).json({ status: false, msg: "Bad request" });
        //check user use rafferal or not
        if (request.body.referralCode) {
            let res = await Info.findOne({ userRefCode: request.body.referralCode });
            if (res) {
                res.refUserCount = res.refUserCount + 1;
                let percentageNo = 1;
                if (res.refUserCount == 1) {
                    percentageNo = 5;
                }
                if (res.refUserCount == 2) {
                    percentageNo = 3;
                }
                if (res.refUserCount == 3) {
                    percentageNo = 2;
                }
                await Info.updateOne({ _id: res._id },
                    { $set: { refUserCount: res.refUserCount, tokens: res.tokens + ((tokenNo * 10 * percentageNo) / 100) } },
                    { session });
            }
            else {
                return response.status(200).json({ status: false, msg: "Bad request", reffWrong: true })
            }
        }

        let salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);

        let user = await User.create([request.body], { session });
        // genrate refferal code
        let code = await genrateCode();
        await Info.create([{ userId: user[0]._id.toString(), userRefCode: code }], { session });

        await session.commitTransaction();
        return response.status(200).json({ status: true, msg: "Sign Up Success" })
    } catch (error) {
        await session.abortTransaction();
        response.status(500).json({ status: false, msg: "internal server error" });
    } finally {
        session.endSession();
    }

}

const genrateCode = async () => {
    let tri = crypto.randomBytes(6);
    let strRandom = crypto.randomBytes(6).toString('hex');
    let obj = await Info.findOne({ userRefCode: strRandom });
    if (!obj)
        return strRandom;
    else
        return await genrateCode();
}

export const signIn = async (request, response, next) => {
    try {
        let user = await User.findOne({ email: request.body.email });
        if (!user)
            return response.status(401).json({ status: false, msg: "Unauthorized request111111" });
        let pasStatus = await bcrypt.compare(request.body.password, user.password);
        if (!pasStatus)
            return response.status(401).json({ status: false, msg: "Unauthorized request222222" });
        let veriToken = jwt.sign({ email: request.body.email }, "qwertyuiop");
        request.body.veriToken = veriToken;
        const { password, ...newObj } = { ...request.body }; //for delete password
        let result = await Info.findOne({ userId: user._id });
        Object.assign(newObj, { userId: result.userId.toString(), userRefCode: result.userRefCode });
        return response.status(200).json({ status: true, msg: "Sign in Success", result: newObj });
    } catch (err) {
        response.status(500).json({ status: false, msg: "internal server error" });
    }
}

export const findInfo = async (request, response, next) => {
    try {
        let result = await Info.findOne({ userId: request.body.userId });
        let result2 = await User.findOne({ _id: request.body.userId });
        let fname = result2.fname;
        let lname = result2.lname;
        response.status(200).json({ status: true, result: { ...result, fname: fname, lname: lname } });
    } catch (err) {
        response.status(500).json({ status: false, msg: "internal server error" });
    }
}

export const refUserList = async (request, response, next) => {
    try {
        let result1 = await Info.findOne({ userId: request.body.userId });
        let result = await User.find({ referralCode: result1.userRefCode });
        response.status(200).json({ status: true, result: result });
    } catch (err) {
        response.status(500).json({ status: false, msg: "internal server error" });
    }
}
