/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @ts-expect-error i know there isn't a type declaration file - i don't care
import fetch from "node-fetch";
import fs from "fs";
import { Gif, User } from "../models";
import { getRandomIntLimit } from "../utils";
import { Express, IGif } from "../types";
import { Response } from "express";
import { readEnv } from "../utils";
import { handleError } from "../utils/handleApiError";
import { Blob } from "buffer";
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

    saveGifsAsStrings: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            if (process.env.NODE_ENV === "test") {
                // console.log("str", Buffer.from(req._readableState.buffer[0]).toString("base64").length);
            } else {
                const { listName } = req.body as { listName: string; imageName: string };
                const { files } = req;
                const gifSrcs: string[] = [];

                console.log("files", files);
                // for (const [, value] of Object.entries(files!)) {
                //     const buffer = fs.readFileSync(value.path);
                //     gifSrcs.push(Buffer.from(buffer).toString("base64"));
                // }

                // const newGif = {
                //     listOwner: req.user!._id,
                //     listName,
                //     gifSrcs,
                // };

                // const mongoGif = await Gif.create(newGif);
                // console.log("mongo gif??", mongoGif);

                // await User.findOneAndUpdate(
                //     { _id: req.user!._id },
                //     {
                //         $push: {
                //             gifs: mongoGif,
                //         },
                //     },
                //     { new: true }
                // );
            }

            // for testing in jest you MUST send a FUCKING .json({}) at least otherwise there will be
            // open handles hell upon you!!!!!!!!
            return res.status(200).json({ success: true });
        } catch (error) {
            return handleError("saveGifsAsStrings", error, res);
        }
    },

    getGifsAsDataStrings: async function (_: Express.MyRequest, res: Response): Promise<Response> {
        try {
            const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${getRandomIntLimit(
                10,
                15
            )}&offset=${getRandomIntLimit(1, 5)}&rating=g&lang=en`;

            const gifInfo = await fetch(gifLink);
            const gifJson = await gifInfo.json();

            let gif = {} as Omit<IGif, "_id">;

            const gifPromises = gifJson.data.map((data: any) => {
                const mediaUrl = "https://i.giphy.com/";
                const extension = ".webp";
                void mediaUrl;
                void extension;
                const gifID = (data.images.original.url as string).split("/")[4];
                return fetch(`${mediaUrl}${gifID}${extension}`);
            });

            const gifResults = await Promise.all(gifPromises);
            const gifBlobPromises = gifResults.map(async (res: any) => {
                return res.blob();
            });
            const gifBlobs = await Promise.all(gifBlobPromises);
            const blobArrayBufferPromises: Promise<string>[] = gifBlobs.map((blob: Blob) => {
                return blob.arrayBuffer();
            });

            const blobArrayBuffers = await Promise.all(blobArrayBufferPromises);

            const blobStrs: string[] = blobArrayBuffers.map((buffer) => {
                // data:image/${fileExtension};base64, <string>
                return `data:image/webp;base64, ${Buffer.from(buffer).toString("base64")}`;
            });

            gif = {
                _id: uuid.v4(),
                listOwner: "nobody",
                listName: "free",
                gifSrcs: blobStrs,
            } as IGif;
            return res.status(200).json({ gifs: [gif] });
        } catch (error) {
            return handleError("getGifsAsBase64Strings", error, res);
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
