/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User } from "../models";
import { signToken, sendEmail, verifyTokenAsync, readEnv } from "../utils";
import bcrypt from "bcrypt";
import { APP_DOMAIN_PREFIX } from "../constants";
import { Express } from "../types";
import { Response } from "express";
const uuid = require("uuid");
readEnv();
const { RESET_EXPIRATION, SALT } = process.env;
export const UserController = {
  signup: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;
      if (!Boolean(username && email && password))
        return res.status(400).json({
          error: "missing username, email, or password in the signup request.",
        });
      const newUser = await User.create({ ...req.body });

      const token = signToken({
        username: newUser.username,
        email: newUser.email,
        uuid: uuid.v4(),
        _id: newUser._id,
      });

      //set the default preset as the empty string one

      await User.findOneAndUpdate(
        { _id: newUser._id },
        { token, defaultPreset: { presetName: "waves" } },
        { new: true }
      ).select("-password");
      return res.status(201).json({ token, _id: newUser._id });
    } catch (error) {}
  },
  addNewPreset: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { presetName, animVarCoeff } = req.body;
      const updated = await User.findOneAndUpdate(
        { email: req.user!.email },
        {
          $push: {
            presets: { presetName, animVarCoeff },
          },
        },
        { new: true }
      ).select("-password");
      return res.status(200).json({ presets: updated!.presets });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  },
  getUserPresets: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const user = await User.findOne({ email: req!.user!.email });
      return res.status(200).json({ presets: user!.presets });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  },
  getUserDefaultPreset: async function (
    req: Express.MyRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      const foundUser = await User.findOne({ email: req.user!.email }).select("-password");
      return res.status(200).json({ preset: foundUser!.defaultPreset!.presetName });
    } catch (error) {}
  },
  //TODO: when updating, push this preset into the user's preset collection
  // make sure to gather the animVarCoeff or whatever parameters on the preset
  // as part of the default preset prop and include it in the update, (change both default and the preset in the collection)
  updateDefaultPreset: async function (
    req: Express.MyRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      const { defaultPreset } = req.body;
      //have to check if type of string because an empty string preset name is the rainbow test....
      // don't feel like changing the class name on 32 files so just doing this assertion.. it's weird i know....
      if (typeof defaultPreset !== "string")
        return res.status(400).json({ error: "missing preset name in request" });
      const foundUser = await User.findOneAndUpdate(
        { _id: req.user!._id },
        {
          defaultPreset: {
            presetName: defaultPreset,
          },
        },
        { new: true }
      ).select("-password");
      return res.status(200).json({ updated: foundUser!.defaultPreset!.presetName });
    } catch (error) {}
  },
  login: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const {
        usernameOrEmail: { username, email },
        password,
      } = req.body;

      let foundUser = null;
      if (username) {
        foundUser = await User.findOne({ username });
      }
      if (email) {
        foundUser = await User.findOne({ email });
      }

      if (foundUser === null) {
        return res.status(400).json({ error: "Incorrect Credentials" });
      }

      const validPass = await foundUser!.isCorrectPassword(password);
      if (!validPass) {
        return res.status(400).json({ error: "Incorrect Credentials" });
      }

      const token = signToken({
        username: foundUser!.username as string,
        email: foundUser!.email as string,
        uuid: uuid.v4(),
        _id: foundUser!._id,
      });

      if (username) {
        foundUser = await User.findOneAndUpdate({ username }, { token }, { new: true }).select(
          "-password"
        );
      }
      if (email) {
        foundUser = await User.findOneAndUpdate({ email }, { token }, { new: true }).select(
          "-password"
        );
      }

      const returnUser = {
        _id: foundUser!._id as string,
        defaultPreset: foundUser!.defaultPreset!.presetName as string,
        token: foundUser!.token as string,
      };
      return res.status(200).json({ user: returnUser });
    } catch (error) {}
  },
  forgotPassword: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { email } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //silently dont send the email if the email wasn't the right format
      if (!emailRegex.test(email)) return res.status(200).json({ message: "success" });
      const user = await User.findOne({ email }).select("-password");
      // console.log("got a user", user);

      //dont return anything else just a 204 status code which will not carry a response body
      if (user === null) return res.status(200).json({ message: "success" });

      const resetUuid = uuid.v4();
      const token = signToken({
        uuid: resetUuid,
        resetEmail: email,
        exp: RESET_EXPIRATION as string,
      });

      const sendEmailArgs = {
        fromHeader: "Password Reset",
        subject: "Password Reset Request",
        mailTo: email,
        mailHtml: `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${APP_DOMAIN_PREFIX}/changePassword/${token}">Reset your password</a>   
        `,
      };

      await sendEmail(sendEmailArgs);

      return res.status(200).json({ message: "success" });
    } catch (error) {}
  },
  changePassword: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { password, token } = req.body;
      const decoded = await verifyTokenAsync(token);
      if (decoded instanceof Error) return res.status(403).json({ error: decoded });

      const hashed = await bcrypt.hash(password, Number(SALT));
      const user = await User.findOneAndUpdate(
        { email: decoded!.resetEmail },
        {
          password: hashed,
        },
        { new: true }
      ).select("-password");
      if (user === null) return res.status(400).json({ error: "unable to complete this request" });

      const newToken = signToken({
        username: user.username,
        email: user.email,
        _id: user._id,
        uuid: uuid.v4(),
      });

      return res.status(200).json({ done: true, token: newToken });
    } catch (error) {}
  },
};
