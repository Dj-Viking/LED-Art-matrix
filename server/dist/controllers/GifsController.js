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
const models_1 = require("../models");
const utils_1 = require("../utils");
exports.GifsController = {
    getGifsAndOrUpdate: function (_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=trippy&limit=${(0, utils_1.getRandomIntLimit)(10, 15)}&offset=${(0, utils_1.getRandomIntLimit)(1, 5)}&rating=g&lang=en`;
                const gifInfo = yield (0, node_fetch_1.default)(`${gifLink}`);
                const gifJson = yield gifInfo.json();
                const gifDB = yield models_1.Gif.find();
                let newGif = {};
                let gifsArr = [];
                if (gifDB[0] === undefined) {
                    for (let i = 0; i < gifJson.data.length; i++) {
                        newGif = {
                            gifSrc: gifJson.data[i].images.original.url,
                            gifCategory: "trippy",
                            limit: "10",
                        };
                        gifsArr.push(newGif);
                    }
                    const newGifs = yield models_1.Gif.insertMany(gifsArr);
                    return res.status(200).json({ gifs: newGifs });
                }
                if (typeof gifDB[0] === "object") {
                    if (!!gifDB[0]._id) {
                        gifsArr = [];
                        yield models_1.Gif.deleteMany();
                        for (let i = 0; i < gifJson.data.length; i++) {
                            newGif = {
                                gifSrc: gifJson.data[i].images.original.url,
                                gifCategory: "trippy",
                                limit: "10",
                            };
                            gifsArr.push(newGif);
                        }
                        const newGifs = yield models_1.Gif.insertMany(gifsArr);
                        return res.status(200).json({ gifs: newGifs });
                    }
                }
                return res.status(200).json({ message: "found get gifs route" });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
};
//# sourceMappingURL=GifsController.js.map