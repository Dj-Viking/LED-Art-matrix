const fetch = require("node-fetch");
const { Gif } = require("../models");
const { getRandomIntLimit } = require("../utils/getRandomIntLimit");
const GifsController = {
  /**
   * 
   * @param {import("express").Request} _ 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response | void>}
   */
  getGifsAndOrUpdate: async function(_, res) {
    try {
      const gifLink = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=trippy&limit=${getRandomIntLimit(10, 15)}&offset=${getRandomIntLimit(1, 5)}&rating=g&lang=en`;
      const gifInfo = await fetch(`${gifLink}`);
      const gifJson = await gifInfo.json();
      const gifDB = await Gif.find();
      let newGif = {};
      let gifsArr = [];
      if (gifDB[0] === undefined) {
        for (let i = 0; i < gifJson.data.length; i++) {
          newGif = {
            gifSrc: gifJson.data[i].images.original.url,
            gifCategory: "trippy",
            limit: "10" // dont remember what this was for...
          };
          gifsArr.push(newGif);
        }
        const newGifs = await Gif.insertMany(gifsArr);
        return res.status(200).json({ gifs: newGifs });
      }
      if (typeof gifDB[0] === "object") { 
        if (!!gifDB[0]._id) {
          gifsArr = [];
          // delete and replace
          await Gif.deleteMany();
          for (let i = 0; i < gifJson.data.length; i++) {
            newGif = {
              gifSrc: gifJson.data[i].images.original.url,
              gifCategory: "trippy",
              limit: "10"
            }
            gifsArr.push(newGif);
          }
          const newGifs = await Gif.insertMany(gifsArr);
          return res.status(200).json({ gifs: newGifs });
        }
      }
      return res.status(200).json({ message: "found get gifs route" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || error });
    }
  }
};

module.exports = { GifsController };