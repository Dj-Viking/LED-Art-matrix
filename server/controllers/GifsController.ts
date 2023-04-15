/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @ts-expect-error i know there isn't a type declaration file - i don't care
import fetch from "node-fetch";
import { Gif, User } from "../models";
import { getRandomIntLimit } from "../utils";
import { Express, IGif } from "../types";
import { Response } from "express";
import { readEnv } from "../utils";
import { handleError } from "../utils/handleApiError";
const uuid = require("uuid");
readEnv();
const { API_KEY } = process.env;

export const GifsController = {
    storedGifs: async function (_: Express.MyRequest, res: Response): Promise<Response> {
        const gifs = await Gif.find();

        return res.status(200).json({ gifs: gifs });
    },
    unloggedGet: async function (_: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${getRandomIntLimit(
                10,
                15
            )}&offset=${getRandomIntLimit(1, 5)}&rating=g&lang=en`;

            const gifInfo = await fetch(gifLink);
            const gifJson = await gifInfo.json();

            let gifSrcs = [] as IGif["gifSrcs"];
            let gif = {} as Omit<IGif, "_id">;

            for (let i = 0; i < gifJson.data.length; i++) {
                gifSrcs.push(gifJson.data[i].images.original.url);
            }

            gif = {
                _id: uuid.v4(),
                listOwner: "nobody",
                listName: "free",
                gifSrcs,
            } as IGif;
            return res.status(200).json({ gifs: [gif] });
        } catch (error) {
            return handleError("getGifs", error, res);
        }
    },

    getMyGifs: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const user = await User.findOne({ _id: req.user!._id });
            return res.status(200).json({ gifs: user!.gifs });
        } catch (error) {
            return handleError("getMyGifs", error, res);
        }
    },
    makeNewCollection: async function (
        req: Express.MyRequest,
        res: Response
    ): Promise<Response | void> {
        try {
            const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${getRandomIntLimit(
                10,
                15
            )}&offset=${getRandomIntLimit(1, 5)}&rating=g&lang=en`;

            const gifInfo = await fetch(gifLink);
            const gifJson = await gifInfo.json();

            const { listName } = req.body as { listName: string };

            let newGif = {} as Omit<IGif, "_id">;
            let gifSrcs = [] as string[];

            for (let i = 0; i < gifJson.data.length; i++) {
                gifSrcs.push(gifJson.data[i].images.original.url);
            }

            newGif = {
                listOwner: req.user!._id,
                listName,
                gifSrcs,
            };

            const mongoGif = await Gif.create(newGif);

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
            return handleError("makeNewCollection", error, res);
        }
    },
};
