//NODE IMPORTS
const path = require('path');
// require('dotenv').config();
// console.log(process.env.NODE_ENV);
//EXPRESS IMPORTS AND SERVER PORT ASSIGN
const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();
const router = require("./router");

//EXPRESS MIDDLEWARE FUNCTIONS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

const db = require('./config/connection');
const { Preset, SearchTerm } = require('./models');

//USING ADD PRESET MUTATION TO SEED DATABASE WITH AVAILABLE CATEGORIES TO SEARCH
// IN A DROPDOWN MENU
async function seedSearchTerms() {
  //check if search terms exist
  const getSearchTerm = await SearchTerm.find();
  if (getSearchTerm[0] === undefined) {
    await SearchTerm.create
    (
      {
        termText: "trippy",
        termCategory: "trippy",
        limit: "10"
      }
    );
  } else {
    console.log("\x1b[37m", "starting categories already seeded...", "\x1b[00m")
  }
}
//USING ADD PRESET MUTATION TO SEED DATABASE WITH EXISTING PRESETS
async function seedPresets() {
  //check if presets exist already
  const presetInfo = await Preset.find();
  //console.log(presetInfo);
  if (presetInfo[0] === undefined) {
    await Preset.insertMany
    (
      [
        {
          presetName: ''
        },
        {
          presetName: 'V2'
        },
        {
          presetName: 'waves'
        },
        {
          presetName: 'spiral'
        },
        {
          presetName: 'fourSpirals'
        }
      ]
    );
    console.log("\x1b[37m", "presets seeded...", "\x1b[00m");
  } else {
    console.log("\x1b[37m", "starting presets already seeded...", "\x1b[00m")
  }
}
//STATIC PUBLIC FRONT END ASSETS WHILE IN DEVELOPMENT
// app.use('/images', express.static(path.join(__dirname, '../client/images')));

//IF-ENV IN DEPLOYMENT
if (process.env.NODE_ENV === 'production') {
  //STATIC ASSETS FROM REACT BUILD FOLDER
  app.use(
    express.static(
      path.join(__dirname, '../client/build')
    )
  );
  // IF TRAVELS ANY ROUTE OUTSIDE REACT'S CURRENT PAGE REDIRECT TO ROOT
  app.get('*', (req, res) => {
    console.log("IN THE GET STAR");
    res.sendFile(
      path.join(
        __dirname, '../client/build/index.html'
      )
    )
  });
  //REDIRECT HTTP TRAFFIC TO HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

//OPEN DATABASE AND THEN START SERVER
db.once('open', () => {
  console.log("db opened");
  app.listen(PORT, () => {
    //SERVER LISTENING ON PORT
    setTimeout(() => {
      console.log("\x1b[33m",`🔊 🎶 now listening on port ${PORT} 🔊 🎶`, "\x1b[00m");
    }, 300);
    setTimeout(() => {
      console.log("\x1b[34m", `🌎 node environment install success listening on port ${PORT} 🌎`, "\x1b[00m");
    }, 400);
    setTimeout(() => {
      console.log("\x1b[32m", `🌱 if in development: stand by for react server to begin...`, "\x1b[00m");
    }, 600);

    //seed Presets and SearchTerms tables with new preset names so the user can add them to their account as a default starting values
    setTimeout( async () => {
      seedPresets();
    }, 700);
    setTimeout( async () => {
      seedSearchTerms();
    }, 800);
  });
});