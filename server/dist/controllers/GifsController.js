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
exports.GifsController = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const handleApiError_1 = require("../utils/handleApiError");
const uuid = require("uuid");
(0, utils_2.readEnv)();
const { API_KEY } = process.env;
exports.GifsController = {
    storedGifs: function (_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gifs = yield models_1.Gif.find();
            return res.status(200).json({ gifs: gifs });
        });
    },
    unloggedGet: function (_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${(0, utils_1.getRandomIntLimit)(10, 15)}&offset=${(0, utils_1.getRandomIntLimit)(1, 5)}&rating=g&lang=en`;
                const gifInfo = yield (0, node_fetch_1.default)(gifLink);
                const gifJson = yield gifInfo.json();
                let gifSrcs = [];
                let gif = {};
                for (let i = 0; i < gifJson.data.length; i++) {
                    gifSrcs.push(gifJson.data[i].images.original.url);
                }
                gif = {
                    _id: uuid.v4(),
                    listOwner: "nobody",
                    listName: "free",
                    gifSrcs,
                };
                return res.status(200).json({ gifs: [gif] });
            }
            catch (error) {
                return (0, handleApiError_1.handleError)("getGifs", error, res);
            }
        });
    },
    saveGifsAsStrings: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (process.env.NODE_ENV === "test") {
                }
                else {
                    const { listName: reqListName, gifCount, reqId, } = req.body;
                    const { files } = req;
                    const gifCountNum = Number(gifCount);
                    const buffer = fs_1.default.readFileSync(Object.values(files)[0].path);
                    const filestr = Buffer.from(buffer).toString("base64");
                    const tempJsonPath = (() => {
                        return process.env.NODE_ENV === "development"
                            ? __dirname + `../../../../data_${reqId}.json`
                            : `/opt/render/project/data_${reqId}.json`;
                    })();
                    if (!fs_1.default.existsSync(tempJsonPath)) {
                        fs_1.default.writeFileSync(tempJsonPath, JSON.stringify([`data:image/webp;base64, ${filestr}`], null, 4));
                    }
                    const existingData = JSON.parse(fs_1.default.readFileSync(tempJsonPath, { encoding: "utf-8" }));
                    if (existingData.length === gifCountNum) {
                        const mongoGif = yield models_1.Gif.create({
                            listName: reqListName,
                            listOwner: req.user._id.toString(),
                            gifSrcs: existingData.filter((str) => str.length < 500000),
                        });
                        const updatedUser = yield models_1.User.findOneAndUpdate({ email: req.user.email }, {
                            $push: {
                                gifs: mongoGif,
                            },
                        }, { new: true });
                        yield models_1.Gif.deleteMany({ listName: reqListName });
                        fs_1.default.unlinkSync(tempJsonPath);
                        return res.status(200).json([...updatedUser.gifs]);
                    }
                    else {
                        existingData.push(`data:image/webp;base64, ${filestr}`);
                        fs_1.default.writeFileSync(tempJsonPath, JSON.stringify(existingData, null, 4));
                        return res.status(200).json([]);
                    }
                }
                return res.status(200).json([]);
            }
            catch (error) {
                return (0, handleApiError_1.handleError)("saveGifsAsStrings", error, res);
            }
        });
    },
    getGifsAsDataStrings: function (_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${(0, utils_1.getRandomIntLimit)(10, 15)}&offset=${(0, utils_1.getRandomIntLimit)(1, 5)}&rating=g&lang=en`;
                const gifInfo = yield (0, node_fetch_1.default)(gifLink);
                const gifJson = yield gifInfo.json();
                let gif = {};
                const gifPromises = gifJson.data.map((data) => {
                    const mediaUrl = "https://i.giphy.com/";
                    const extension = ".webp";
                    void mediaUrl;
                    void extension;
                    const gifID = data.images.original.url.split("/")[4];
                    return (0, node_fetch_1.default)(`${mediaUrl}${gifID}${extension}`);
                });
                const gifResults = yield Promise.all(gifPromises);
                const gifBlobPromises = gifResults.map((res) => __awaiter(this, void 0, void 0, function* () {
                    return res.blob();
                }));
                const gifBlobs = yield Promise.all(gifBlobPromises);
                const blobArrayBufferPromises = gifBlobs.map((blob) => {
                    return blob.arrayBuffer();
                });
                const blobArrayBuffers = yield Promise.all(blobArrayBufferPromises);
                const blobStrs = blobArrayBuffers.map((buffer) => {
                    return `data:image/webp;base64, ${Buffer.from(buffer).toString("base64")}`;
                });
                gif = {
                    _id: uuid.v4(),
                    listOwner: "nobody",
                    listName: "free",
                    gifSrcs: blobStrs,
                };
                return res.status(200).json({ gifs: [gif] });
            }
            catch (error) {
                return (0, handleApiError_1.handleError)("getGifsAsBase64Strings", error, res);
            }
        });
    },
    getMyGifs: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({ _id: req.user._id });
                return res.status(200).json({ gifs: user.gifs });
            }
            catch (error) {
                return (0, handleApiError_1.handleError)("getMyGifs", error, res);
            }
        });
    },
    makeNewCollection: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=trippy&limit=${(0, utils_1.getRandomIntLimit)(10, 15)}&offset=${(0, utils_1.getRandomIntLimit)(1, 5)}&rating=g&lang=en`;
                const gifInfo = yield (0, node_fetch_1.default)(gifLink);
                const gifJson = yield gifInfo.json();
                const { listName } = req.body;
                let newGif = {};
                let gifSrcs = [];
                for (let i = 0; i < gifJson.data.length; i++) {
                    gifSrcs.push(gifJson.data[i].images.original.url);
                }
                newGif = {
                    listOwner: req.user._id,
                    listName,
                    gifSrcs,
                };
                const mongoGif = yield models_1.Gif.create(newGif);
                const user = yield models_1.User.findOneAndUpdate({ _id: req.user._id }, {
                    $push: {
                        gifs: mongoGif,
                    },
                }, { new: true });
                return res.status(200).json({ gifs: user.gifs });
            }
            catch (error) {
                return (0, handleApiError_1.handleError)("makeNewCollection", error, res);
            }
        });
    },
};
//# sourceMappingURL=GifsController.js.map