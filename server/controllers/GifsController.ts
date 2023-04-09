/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @ts-expect-error i know there isn't a type declaration file - i don't care
import fetch from "node-fetch";
import { Gif, User } from "../models";
import { getRandomIntLimit } from "../utils";
import { Express, IGif } from "../types";
import { Response } from "express";
import { readEnv } from "../utils";
readEnv();
const { API_KEY } = process.env;
export const GifsController = {
    getGifs: async function (_: Express.MyRequest, res: Response): Promise<Response> {
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
                listOwner: "nobody",
                listName: "free",
                gifSrcs,
            };
            return res.status(200).json({ gifs: gif });
        } catch (error) {
            return res.status(500).json({ error: "error in getGifs" + error.message });
        }
    },

    getMyGifs: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const user = User.findOne({ _id: req.user!._id });

            return res.status(200).json({ gifs: user.gifs });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "error during getGifs" + error.message });
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
            const gifDB = await Gif.find();

            let newGif = {} as Omit<IGif, "_id">;
            let gifSrcs = [] as string[];

            if (gifDB[0] === undefined) {
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
                    }
                );
                return res.status(200).json({ gifs: user!.gifs });
            }

            if (typeof gifDB[0] === "object") {
                if (!!gifDB[0]._id) {
                    gifSrcs = [];
                    // delete and replace
                    await Gif.deleteMany();

                    for (let i = 0; i < gifJson.data.length; i++) {
                        gifSrcs.push(gifJson.data[i].images.original.url);
                    }

                    newGif = {
                        listOwner: req.user!._id,
                        listName,
                        gifSrcs,
                    };

                    const mongoGif = await Gif.insertMany(newGif);
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
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error });
        }
    },
};
