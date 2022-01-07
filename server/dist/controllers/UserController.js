"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
require("dotenv").config();
const models_1 = require("../models");
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const uuid = require("uuid");
const { RESET_EXPIRATION } = process.env;
exports.UserController = {
    signup: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                if (!Boolean(username && email && password))
                    return res.status(400).json({ error: "missing username, email, or password in the signup request." });
                const newUser = yield models_1.User.create(Object.assign({}, req.body));
                const token = (0, utils_1.signToken)({
                    username: newUser.username,
                    email: newUser.email,
                    uuid: uuid.v4(),
                    _id: newUser._id,
                });
                yield models_1.User.findOneAndUpdate({ _id: newUser._id }, { token, defaultPreset: "" }, { new: true }).select("-password");
                return res.status(201).json({ token });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    getUserDefaultPreset: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = yield models_1.User.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).select("-password");
                if (foundUser === null) {
                    return res.status(404).json({ error: "user not found" });
                }
                return res.status(200).json({ preset: foundUser.defaultPreset });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    updateDefaultPreset: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { defaultPreset } = req.body;
                if (typeof defaultPreset !== "string")
                    return res.status(400).json({ error: "missing preset name in request" });
                const foundUser = yield models_1.User.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, {
                    defaultPreset
                }, { new: true }).select("-password");
                if (foundUser === null) {
                    return res.status(404).json({ error: "user not found" });
                }
                return res.status(200).json({ updated: foundUser === null || foundUser === void 0 ? void 0 : foundUser.defaultPreset });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    login: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usernameOrEmail: { username, email }, password } = req.body;
                let foundUser;
                if (username) {
                    foundUser = yield models_1.User.findOne({ username: username }).select("-password");
                    console.log("found user", foundUser);
                }
                if (email) {
                    foundUser = yield models_1.User.findOne({ email }).select("-password");
                }
                if (foundUser === null) {
                    return res.status(400).json({ error: "incorrect credentials" });
                }
                const validPass = yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.isCorrectPassword(password));
                if (!validPass) {
                    return res.status(400).json({ error: "incorrect credentials" });
                }
                const token = (0, utils_1.signToken)({
                    username: foundUser === null || foundUser === void 0 ? void 0 : foundUser.username,
                    email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
                    uuid: uuid.v4(),
                    _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id
                });
                if (username) {
                    foundUser = yield models_1.User.findOneAndUpdate({ username }, {
                        token
                    }, { new: true }).select("-password");
                }
                if (email) {
                    foundUser = yield models_1.User.findOneAndUpdate({ email }, {
                        token
                    }, { new: true }).select("-password");
                }
                const returnUser = {
                    defaultPreset: foundUser === null || foundUser === void 0 ? void 0 : foundUser.defaultPreset,
                    token: foundUser === null || foundUser === void 0 ? void 0 : foundUser.token,
                };
                return res.status(200).json({ user: returnUser });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    forgotPassword: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield models_1.User.findOne({ email }).select("-password");
                if (user === null)
                    return res.status(200).json({ message: "success" });
                const resetUuid = uuid.v4();
                const token = (0, utils_1.signToken)({
                    uuid: resetUuid,
                    resetEmail: email,
                    exp: RESET_EXPIRATION
                });
                const sendEmailArgs = {
                    fromHeader: "Password Reset",
                    subject: "Password Reset Request",
                    mailTo: email,
                    mailHtml: `
          <span>We were made aware that you request your password to be reset</span>
          <p>If this wasn't you. Then please disregard this email. Thank you!</p>
          <h2>This Request will expire after 5 minutes.</h2>
          <a href="${constants_1.APP_DOMAIN_PREFIX}/changePassword/${token}">Reset your password</a>   
        `,
                };
                yield (0, utils_1.sendEmail)(sendEmailArgs);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    changePassword: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, token } = req.body;
                const decoded = yield (0, utils_1.verifyTokenAsync)(token);
                if ((decoded instanceof Error))
                    return res.status(403).json({ error: decoded });
                const hashed = yield bcrypt_1.default.hash(password, Number(process.env.SALT));
                const user = yield models_1.User.findOneAndUpdate({ email: decoded === null || decoded === void 0 ? void 0 : decoded.resetEmail }, {
                    password: hashed
                }, { new: true }).select("-password");
                if (user === null)
                    return res.status(400).json({ error: "unable to complete this request" });
                const newToken = (0, utils_1.signToken)({
                    username: user.username,
                    email: user.email,
                    _id: user._id,
                    uuid: uuid.v4()
                });
                return res.status(200).json({ done: true, token: newToken });
            }
            catch (error) {
                console.error("error when changing password", error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
};
//# sourceMappingURL=UserController.js.map