require("dotenv").config()
const { RESET_EXPIRATION } = process.env;
const mongoose = require("mongoose");
const { User } = require("../models");
const { signToken } = require("../utils/signToken");
const { sendEmail } = require("../utils/sendEmail");
const { verifyAsync } = require("../utils/verifyAsync");
const bcrypt = require("bcrypt");
const { APP_DOMAIN_PREFIX } = require("../constants");
const uuid = require("uuid");
const UserController = {
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  signup: async function(req, res) {
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

      await User.findOneAndUpdate({ _id: newUser._id }, { token, defaultPreset: "" }, { new: true });
      return res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: error.message || error});
    }
  },
  /**
   * 
   * @param {import("express").Request & { user: {_id: string, username: string, uuid: string, email: string, exp: number, iat: number}}} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  getUserDefaultPreset: async function(req, res) {
    try {
      const foundUser = await User.findOne({ _id: req.user._id });``
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      return res.status(200).json({ preset: foundUser.defaultPreset });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  /**
   * 
   * @param {import("express").Request & { user: {_id: string, username: string, uuid: string, email: string, exp: number, iat: number}}} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  updateDefaultPreset: async function(req, res) {
    try {
      const { defaultPreset } = req.body;
      //have to check if type of string because an empty string preset name is the rainbow test....
      // don't feel like changing the class name on 32 files so just doing this assertion.. it's weird i know....
      if(typeof defaultPreset !== "string") return res.status(400).json({error: "missing preset name in request"});
      const foundUser = await User.findOneAndUpdate({ _id: req.user._id }, {
        defaultPreset: {
          presetName: defaultPreset
        }
      }, { new: true }).select("-password");
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      return res.status(200).json({ updated: foundUser.defaultPreset.presetName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  },
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  login: async function(req, res) {
    try {
      const { usernameOrEmail: { username, email }, password } = req.body;

      let foundUser;
      if (username) {
        foundUser = await User.findOne({ username });
      }
      if (email) {
        foundUser = await User.findOne({ email });
      }

      if (foundUser === null) {
        return res.status(400).json({ error: "incorrect credentials" });
      }
      
      const validPass = await foundUser.isCorrectPassword(password);
      if (!validPass) {
        return res.status(400).json({ error: "incorrect credentials" });
      }
      
      const token = signToken({
        username: foundUser.username,
        email: foundUser.email,
        uuid: uuid.v4(),
        _id: foundUser._id
      });

      if (username) {
        foundUser = await User.findOneAndUpdate({ username }, {
          token
        }, { new: true });
      }
      if (email) {
        foundUser = await User.findOneAndUpdate({ email }, {
          token
        }, { new: true });
      }

      const returnUser = {
        defaultPreset: foundUser.defaultPreset.presetName,
        token: foundUser.token,
      }
      return res.status(200).json({ user: returnUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error});
    }
  },
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  forgotPassword: async function (req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      //dont return anything else just a 204 status code which will not carry a response body
      if (user === null) return res.status(200).json({message: "success"})

      const resetUuid = uuid.v4();
      const token = signToken({
        uuid: resetUuid,
        resetEmail: email,
        exp: RESET_EXPIRATION
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
  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  changePassword: async function(req, res) {
    try {
      const { password, token } = req.body;
      const decoded = await verifyAsync(token);
      if ((decoded instanceof Error)) 
        return res.status(403).json({ error: decoded });
      
      
      const hashed = await bcrypt.hash(password, Number(process.env.SALT));
      const user = await User.findOneAndUpdate({ email:  decoded.resetEmail }, {
        password: hashed
      }, { new: true });
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


module.exports = { UserController };