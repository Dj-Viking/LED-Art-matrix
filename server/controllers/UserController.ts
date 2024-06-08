/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Gif, User } from "../models";
import { signToken, sendEmail, verifyTokenAsync, readEnv } from "../utils";
import bcrypt from "bcryptjs";
import { APP_DOMAIN_PREFIX, INITIAL_PRESETS } from "../constants";
import { Express, IGif } from "../types";
import { Response } from "express";
import { PresetClass } from "../models/PresetClass";
import { UserClass } from "../models/User";
import { handleError } from "../utils/handleApiError";
const uuid = require("uuid");
readEnv();
const { RESET_EXPIRATION, SALT } = process.env;
export const UserController = {
    removeGifCollection: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.user!._id },
                {
                    $pull: {
                        gifs: { _id: req.body._id },
                    },
                },
                { new: true }
            );
            return res.status(200).json({ gifs: user!.gifs });
        } catch (error) {
            return handleError("removeGifCollection", error, res);
        }
    },
    createGifCollection: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const { gif, listName } = req.body as { gif: IGif; listName: string };

            gif.listOwner = req.user!._id;
            gif.listName = listName;

            const mongoGif = await Gif.create(gif);

            const user = await User.findOneAndUpdate(
                { _id: req.user!._id },
                {
                    $push: {
                        gifs: mongoGif,
                    },
                },
                { new: true }
            );

            return res.status(200).json({ gifs: user!.gifs });
        } catch (error) {
            return handleError("createGifCollection", error, res);
        }
    },
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
                {
                    $set: {
                        presets: INITIAL_PRESETS,
                    },
                    token,
                    defaultPreset: {
                        presetName: "waves",
                        animVarCoeff: "1",
                        displayName: "waves",
                    },
                },
                { new: true }
            ).select("-password");
            return res.status(201).json({ token, _id: newUser._id });
        } catch (error) {
            return handleError("signup", error, res);
        }
    },
    createAllDefaultPresets: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: req!.user!.email },
                {
                    $set: {
                        presets: INITIAL_PRESETS,
                    },
                    defaultPreset: {
                        presetName: "waves",
                        animVarCoeff: "1",
                        displayName: "waves",
                    },
                },
                { new: true }
            ).select("-password");

            return res.status(200).json({ presets: updatedUser!.presets });
        } catch (error) {
            handleError("createAllDefaultPresets", error, res);
        }
    },
    deleteUserPreset: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const { _id } = req.body;

            //get the default and check if the id matches the one in the req.body
            const user: UserClass = (await User.findOne({ email: req!.user!.email })) as UserClass;

            // @ts-ignore have to use toHexString in the endpoint
            // somehow in the test it comes back as a string but straight from the database
            // it is still a type of object as ObjectId("_id")
            const defId = user!.defaultPreset!._id.toHexString();

            const updateOptions = ((bodyId: string, defId: string) => {
                if (bodyId === defId) {
                    return {
                        //initialize the default preset to something blank if the preset being deleted is the default one
                        $set: {
                            defaultPreset: {
                                presetName: "",
                                animVarCoeff: "1",
                                displayName: "",
                            },
                        },
                        $pull: {
                            presets: { _id: bodyId },
                        },
                    };
                }
                return {
                    $pull: {
                        presets: { _id: bodyId },
                    },
                };
            })(_id, defId);

            await User.findOneAndUpdate({ email: req!.user!.email }, updateOptions);
            res.status(200).json({ message: "deleted the preset" });
        } catch (error) {
            handleError("deleteUserPreset", error, res);
        }
    },
    addNewPreset: async function (req: Express.MyRequest, res: Response): Promise<Response | void> {
        try {
            const { presetName, animVarCoeff, displayName } = req.body;
            const updated = await User.findOneAndUpdate(
                { email: req.user!.email },
                {
                    $push: {
                        presets: { presetName, animVarCoeff, displayName },
                    },
                },
                { new: true }
            ).select("-password");
            return res.status(200).json({ presets: updated!.presets });
        } catch (error) {
            return handleError("addNewPreset", error, res);
        }
    },
    getUserPresets: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const user = await User.findOne({ email: req!.user!.email });
            return res.status(200).json({ presets: user!.presets });
        } catch (error) {
            return handleError("getUserPresets", error, res);
        }
    },
    getUserDefaultPreset: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const foundUser = await User.findOne({ email: req.user!.email }).select("-password");
            return res.status(200).json({
                preset: {
                    displayName: foundUser!.defaultPreset?.displayName,
                    presetName: foundUser!.defaultPreset?.presetName,
                    animVarCoeff: foundUser!.defaultPreset?.animVarCoeff,
                    _id: foundUser!.defaultPreset?._id,
                },
            });
        } catch (error) {
            return handleError("getUserDefaultPreset", error, res);
        }
    },
    //TODO: when updating, push this preset into the user's preset collection
    // make sure to gather the animVarCoeff or whatever parameters on the preset
    // as part of the default preset prop and include it in the update, (change both default and the preset in the collection)
    updateDefaultPreset: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const { defaultPreset, animVarCoeff, displayName, _id } = req.body;
            //have to check if type of string because an empty string preset name is the rainbow test....
            // don't feel like changing the class name on 32 files so just doing this assertion.. it's weird i know....
            if (typeof defaultPreset !== "string")
                return res.status(400).json({ error: "missing preset name in request" });
            const foundUser = await User.findOneAndUpdate(
                { _id: req!.user!._id },
                {
                    $set: {
                        defaultPreset: {
                            _id,
                            presetName: defaultPreset,
                            displayName,
                            animVarCoeff,
                        },
                    },
                },
                { new: true }
            ).select("-password");
            return res.status(200).json({
                preset: {
                    _id: foundUser!.defaultPreset!._id,
                    displayName: foundUser!.defaultPreset!.displayName,
                    presetName: foundUser!.defaultPreset!.presetName,
                    animVarCoeff: foundUser!.defaultPreset!.animVarCoeff,
                },
            });
        } catch (error) {
            return handleError("updateDefaultPreset", error, res);
        }
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
                foundUser = await User.findOneAndUpdate(
                    { username },
                    { token },
                    { new: true }
                ).select("-password");
            }
            if (email) {
                foundUser = await User.findOneAndUpdate({ email }, { token }, { new: true }).select(
                    "-password"
                );
            }

            const returnUser = {
                _id: foundUser!._id,
                defaultPreset: foundUser!.defaultPreset as PresetClass,
                token: foundUser!.token as string,
            };
            return res.status(200).json({ user: returnUser });
        } catch (error) {
            return handleError("login", error, res);
        }
    },
    forgotPassword: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const { email } = req.body as { email: string };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            //silently dont send the email if the email wasn't the right format
            if (!emailRegex.test(email)) return res.status(200).json({ message: "success" });
            const user = await User.findOne({ email }).select("-password");

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
        } catch (error) {
            return handleError("forgotPassword", error, res);
        }
    },
    changePassword: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
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
            if (user === null)
                return res.status(400).json({ error: "unable to complete this request" });

            const newToken = signToken({
                username: user.username,
                email: user.email,
                _id: user._id,
                uuid: uuid.v4(),
            });

            return res.status(200).json({ done: true, token: newToken });
        } catch (error) {
            return handleError("changePassword", error, res);
        }
    },
};
