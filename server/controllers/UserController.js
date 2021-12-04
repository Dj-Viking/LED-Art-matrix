const { User, Preset } = require("../models");
const { signToken } = require("../utils/signToken");
const { sendEmail } = require("../utils/sendEmail");
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

      await User.findOneAndUpdate({ _id: newUser._id }, { token }, { new: true });
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
      const foundUser = await User.findOne({ _id: req.user._id });
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      const preset = await Preset.findOne({ _id: foundUser.defaultPreset });
      return res.status(200).json({ preset });
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
      console.log("type of sent preset name", typeof defaultPreset);
      //have to check if type of string because an empty string preset name is the rainbow test....
      // don't feel like changing the class name on 32 files so just doing this assertion.. it's weird i know....
      if(typeof defaultPreset !== "string") return res.status(400).json({error: "missing preset name in request"});
      const foundPreset = await Preset.findOne({presetName: defaultPreset});
      console.log("found preset", foundPreset);
      const foundUser = await User.findOneAndUpdate({ _id: req.user._id }, {
        $set: {
          defaultPreset: foundPreset
        }
      }, { new: true });
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      console.log("found user hopefully with same preset name", foundUser);
      return res.status(200).json({ updated: foundPreset.presetName });
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
      const { password, email } = req.body;
      
      const foundUser = await User.findOne({ email });
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

      const updatedUser = await User.findOneAndUpdate({ email }, {
        token
      }, { new: true });

      const preset = await Preset.findOne({_id: updatedUser.defaultPreset});

      const returnUser = {
        defaultPreset: preset.presetName,
        token: updatedUser.token,
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
        exp: "5m"
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
  getAllUsers: async function(req, res) {
    try {
      const all = await User.find();
      return res.status(200).json({ all });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  }
};


module.exports = { UserController };