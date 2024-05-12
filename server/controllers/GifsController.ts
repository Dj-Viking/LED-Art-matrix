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
                const { listName, gifCount } = req.body as { listName: string; gifCount: string };
                const { files } = req;
                const gifCountNum = Number(gifCount);

                // console.log("files", files);
                // since i can't save more than 17MB in a mongo db transaction
                // just going to save the gifs one by one since one isn't bigger than 17MB i think

                // idea for now - write to a temporary json file each new gif image
                // then when the amount of keys in that json equal the count of gifs I'm sending
                // then update the user with a new collection
                // update user's new gif collection one by one because
                // the transaction is going to be too big
                const buffer = fs.readFileSync(Object.values(files!)[0].path);

                const filestr = Buffer.from(buffer).toString("base64");

                console.log("str len\n------\n", filestr.length);

                const jsonPath = __dirname + "../../../../gifs.json";

                let gifsJson: Record<"gif", { gifSrcs: string[] }>;
                if (fs.existsSync(jsonPath)) {
                    console.log("\x1b[32m file exists \x1b[00m ");
                    gifsJson = require(jsonPath);
                    if (gifsJson.gif.gifSrcs.length <= gifCountNum - 1) {
                        gifsJson.gif.gifSrcs.push(`data:image/webp;base64, ${filestr}`);
                        fs.writeFileSync(jsonPath, JSON.stringify(gifsJson, null, 4), {
                            encoding: "utf-8",
                        });
                    }
                    if (gifsJson.gif.gifSrcs.length === gifCountNum) {
                        fs.unlinkSync(jsonPath);
                        const gifToSave = {
                            // reduce the size of query by filtering out strings that
                            // are longer than a some big number (for now)
                            gifSrcs: gifsJson.gif.gifSrcs.filter((src) => src.length < 1_000_000),
                            listOwner: req!.user!._id,
                            listName: listName,
                        } as IGif;

                        console.log("about to create gif");

                        const mongoGif = await Gif.create(gifToSave);

                        console.log("mongo gif", mongoGif._id);

                        await User.findOneAndUpdate(
                            { _id: req.user!._id },
                            {
                                $push: {
                                    gifs: mongoGif,
                                },
                            },
                            { new: true }
                        );
                    }
                } else {
                    console.log("\x1b[32m file does not exist \x1b[00m");
                    // add the first one
                    const obj: Record<"gif", { gifSrcs: string[] }> = {
                        gif: {
                            gifSrcs: [`data:image/webp;base64, ${filestr}`],
                        },
                    };
                    fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 4), {
                        encoding: "utf-8",
                    });
                }
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
