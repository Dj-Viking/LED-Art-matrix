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

    // @ts-ignore
    saveGifsAsStrings: async function (req: Express.MyRequest, res: Response): Promise<Response> {
        try {
            if (process.env.NODE_ENV === "test") {
            } else {
                const {
                    listName: reqListName,
                    gifCount,
                    reqId,
                } = req.body as {
                    listName: string;
                    gifCount: string;
                    reqId: string;
                };
                const { files } = req;
                const gifCountNum = Number(gifCount);

                // since i can't save more than 17MB in a mongo db transaction
                // just going to save the gifs one by one since one isn't bigger than 17MB i think

                const buffer = fs.readFileSync(Object.values(files!)[0].path);

                const filestr = Buffer.from(buffer).toString("base64");

                const tempJsonPath = (() => {
                    return process.env.NODE_ENV === "development"
                        ? __dirname + `../../../../data_${reqId}.json`
                        : `/opt/render/project/data_${reqId}.json`;
                })();

                if (!fs.existsSync(tempJsonPath)) {
                    // new data
                    fs.writeFileSync(
                        tempJsonPath,
                        JSON.stringify([`data:image/webp;base64, ${filestr}`], null, 4)
                    );
                }
                const existingData = JSON.parse(
                    fs.readFileSync(tempJsonPath, { encoding: "utf-8" })
                ) as string[];

                if (existingData.length === gifCountNum) {
                    const mongoGif = await Gif.create({
                        listName: reqListName,
                        listOwner: req!.user!._id.toString(),
                        gifSrcs: existingData.filter((str) => str.length < 500_000),
                    });
                    const updatedUser = await User.findOneAndUpdate(
                        { email: req!.user!.email },
                        {
                            $push: {
                                gifs: mongoGif,
                            },
                        },
                        { new: true }
                    );

                    await Gif.deleteMany({ listName: reqListName });

                    // NOTE(Anders): the file handle will be released when the node process is killed
                    // file handle is still open while node process is running
                    fs.unlinkSync(tempJsonPath);

                    return res.status(200).json([...updatedUser!.gifs]);
                } else {
                    existingData.push(`data:image/webp;base64, ${filestr}`);
                    fs.writeFileSync(tempJsonPath, JSON.stringify(existingData, null, 4));
                    return res.status(200).json([]);
                }
            }
            return res.status(200).json([]);
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
				
				// update 5-17-2025: the api got updated so now the gif id is in a different position
				// now it seems like it's in the 5th position between the routes when it was 4th position for a long time
                const gifID = (data.images.original.url as string).split("/")[5];

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
