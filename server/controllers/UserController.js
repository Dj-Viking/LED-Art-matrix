const { User, Preset } = require("../models");
const { signToken } = require("../utils/signToken");
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
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  getUserDefaultPreset: async function(req, res) {
    try {
      const foundUser = await User.findOne({ _id: req.user._id });
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      const preset = await Preset.findOne({ _id: foundUser.defaultPreset._id });
      return res.status(200).json({ preset });
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
  updateDefaultPreset: async function(req, res) {
    try {
      const { defaultPreset } = req.body;
      if(!defaultPreset) return res.status(400).json({error: "missing preset name in request"});
      const foundUser = User.findOneAndUpdate({ _id: req.user._id }, {
        defaultPreset: req.body.defaultPreset
      }, { new: true });
      if (foundUser === null) {
        return res.status(404).json({ error: "user not found" });
      }
      return res.status(200).json({ updated: true });
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
  }
};


module.exports = { UserController };