//NODE IMPORTS
import path from "path";
require("dotenv").config();
import { APP_DOMAIN_PREFIX, IS_PROD } from "./constants";
import express from "express";
import cors from "cors";
import router from "./router";
import connection from "./config/connection";
import { SearchTerm } from "./models";

const app = express();
const PORT = process.env.PORT || 3001;
const formData = require("express-form-data");
const corsRegexp = (() => new RegExp(APP_DOMAIN_PREFIX, "g"))();
app.use(express.urlencoded({ extended: false }));
app.use(formData.parse());
app.use(express.json());
// this cors package is handling setting the correct headers for
// cross origin resource sharing between client and server
app.use(
    cors({
        origin: IS_PROD ? corsRegexp : "http://localhost:3000",
        credentials: true,
    })
);
app.use(router);

async function seedSearchTerms(): Promise<void> {
    //check if search terms exist
    const getSearchTerm = await SearchTerm.find();
    if (getSearchTerm[0] === undefined) {
        await SearchTerm.create({
            termText: "trippy",
            termCategory: "trippy",
            limit: "10",
        });
    } else {
        console.log("\x1b[37m", "starting categories already seeded...", "\x1b[00m");
    }
}

if (process.env.NODE_ENV === "production") {
    //STATIC ASSETS FROM REACT BUILD FOLDER
    app.use(express.static(path.resolve("../client/build")));
    // IF TRAVELS ANY ROUTE OUTSIDE REACT'S CURRENT PAGE REDIRECT TO ROOT
    app.get("*", (_, res) => {
        console.log("IN THE GET STAR");
        res.sendFile(path.resolve("../client/build/index.html"));
        // TODO(anders): react client to make this page possible.
        // may trigger a 404 error page if react client is configured to do so.
    });
    //REDIRECT HTTP TRAFFIC TO HTTPS
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") {
            res.redirect(`https://${req.header("host")}${req.url}`);
        }
        next();
    });
}

//OPEN DATABASE AND THEN START SERVER
connection.once("open", () => {
    console.log("mongodb connection opened");
    app.listen(PORT, () => {
        //SERVER LISTENING ON PORT
        setTimeout(() => {
            console.log("\x1b[33m", `🔊 🎶 now listening on port ${PORT} 🔊 🎶`, "\x1b[00m");
        }, 300);
        setTimeout(() => {
            console.log(
                "\x1b[33m",
                `🌎 node environment install success listening on port ${PORT} 🌎`,
                "\x1b[00m"
            );
        }, 400);
        setTimeout(() => {
            console.log(
                "\x1b[32m",
                `🌱 if in development: stand by for react server to begin...`,
                "\x1b[00m"
            );
        }, 600);

        //seed Presets and SearchTerms tables with new preset names so the user can add them to their account as a default starting values
        setTimeout(async () => {
            await seedSearchTerms();
        }, 800);
    });
});
