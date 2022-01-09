import { User } from "../models";
import { signToken, sendEmail, verifyTokenAsync, readEnv } from "../utils";
import bcrypt from "bcrypt"; 
import { APP_DOMAIN_PREFIX } from "../constants";
import { Express } from "../types";
import { Response } from "express";
const uuid = require("uuid");
readEnv();
const { RESET_EXPIRATION } = process.env;
export const UserController = {
  signup: async function(req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;
      if (!Boolean(username && email && password)) return res.status(400).json({error: "missing username, email, or password in the signup request."});
      const newUser = await User.create({...req.body});
      
      const token = signToken({
        username: newUser.username,
        email: newUser.email,
        uuid: uuid.v4(),
        _id: newUser._id,
      });

      //set the default preset as the empty string one

      await User.findOneAndUpdate({ _id: newUser._id }, { token, defaultPreset: { presetName: "" } }, { new: true }).select("-password");
      return res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: error.message || error});
    }
  },
  getUserDefaultPreset: async function(req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const foundUser = await User.findOne({ _id: req.user?._id }).select("-password");
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      return res.status(200).json({ preset: foundUser?.defaultPreset?.presetName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  updateDefaultPreset: async function(req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { defaultPreset } = req.body;
      console.log("default preset", defaultPreset);
      //have to check if type of string because an empty string preset name is the rainbow test....
      // don't feel like changing the class name on 32 files so just doing this assertion.. it's weird i know....
      if(typeof defaultPreset !== "string") return res.status(400).json({error: "missing preset name in request"});
      const foundUser = await User.findOneAndUpdate({ _id: req.user?._id }, {
        defaultPreset: {
          presetName: defaultPreset
        }
      }, { new: true }).select("-password");
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      return res.status(200).json({ updated: foundUser?.defaultPreset?.presetName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  login: async function(req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { usernameOrEmail: { username, email }, password } = req.body;

      let foundUser;
      if (username) {
        foundUser = await User.findOne({ username: username as string });
      }
      if (email) {
        foundUser = await User.findOne({ email });
      }

      if (foundUser === null) {
        return res.status(400).json({ error: "incorrect credentials" });
      }
      
      const validPass = await foundUser?.isCorrectPassword(password);
      if (!validPass) {
        return res.status(400).json({ error: "incorrect credentials" });
      }
      
      const token = signToken({
        username: foundUser?.username as string,
        email: foundUser?.email as string,
        uuid: uuid.v4(),
        _id: foundUser?._id
      });

      if (username) {
        foundUser = await User.findOneAndUpdate({ username }, {
          token
        }, { new: true }).select("-password");
      }
      if (email) {
        foundUser = await User.findOneAndUpdate({ email }, {
          token
        }, { new: true }).select("-password");
      }

      const returnUser = {
        defaultPreset: foundUser?.defaultPreset?.presetName as string,
        token: foundUser?.token as string,
      }
      return res.status(200).json({ user: returnUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error});
    }
  },
  forgotPassword: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      //dont return anything else just a 204 status code which will not carry a response body
      if (user === null) return res.status(200).json({message: "success"})

      const resetUuid = uuid.v4();
      const token = signToken({
        uuid: resetUuid,
        resetEmail: email,
        exp: RESET_EXPIRATION as string
      });
      
      const sendEmailArgs = {
        fromHeader: "Password Reset",
        subject: "Password Reset Request",
        mailTo: email,
        mailHtml:  `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${APP_DOMAIN_PREFIX}/changePassword/${token}">Reset your password</a>   
        `,
      }
      
      await sendEmail(sendEmailArgs);

      return res.status(200).json({message: "success"});

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  changePassword: async function(req: Express.MyRequest, res: Response): Promise<Response | void>{
    try {
      const { password, token } = req.body;
      const decoded = await verifyTokenAsync(token);
      if ((decoded instanceof Error)) 
        return res.status(403).json({ error: decoded });
      
      
      const hashed = await bcrypt.hash(password, Number(process.env.SALT));
      const user = await User.findOneAndUpdate({ email:  decoded?.resetEmail }, {
        password: hashed
      }, { new: true }).select("-password");
      if (user === null) 
        return res.status(400).json({ error: "unable to complete this request" });

      const newToken = signToken({
        username: user.username,
        email: user.email,
        _id: user._id,
        uuid: uuid.v4()
      });

      return res.status(200).json({ done: true, token: newToken });

    } catch (error) {
      console.error("error when changing password", error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  // getAllUsers: async function(_, res) {
  //   try {
  //     const all = await User.find().select("-password");
  //     return res.status(200).json({ all });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: error.message || error });
  //   }
  // }
};