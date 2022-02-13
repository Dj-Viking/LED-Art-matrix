"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_GIPHY_RES = exports.INITIAL_PRESETS = exports.TEST_PASSWORD = exports.TEST_EMAIL = exports.TEST_USERNAME = exports.APP_DOMAIN_PREFIX = exports.IS_PROD = exports.TEST_DB_URL = void 0;
require("dotenv").config();
exports.TEST_DB_URL = "mongodb://localhost/led-matrix-test";
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://led-matrices.herokuapp.com"
    : "http://localhost:3000";
exports.TEST_USERNAME = "test-user";
exports.TEST_EMAIL = "test@email.com";
exports.TEST_PASSWORD = "test password";
exports.INITIAL_PRESETS = [
    {
        presetName: "rainbowTest",
        displayName: "rainbowTest",
    },
    {
        presetName: "v2",
        displayName: "v2",
    },
    {
        presetName: "waves",
        displayName: "waves",
    },
    {
        presetName: "spiral",
        displayName: "spiral",
    },
    {
        presetName: "fourSpirals",
        displayName: "fourSpirals",
    },
    {
        presetName: "dm5",
        displayName: "dm5",
    },
];
exports.MOCK_GIPHY_RES = {
    data: [
        {
            images: {
                original: {
                    url: `https://media2.giphy.com/media/${(Math.random() * 1000).toString() + "kdjfdkjkj"}/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g`,
                },
            },
        },
        {
            images: {
                original: {
                    url: `https://media2.giphy.com/media/${(Math.random() * 1000).toString() + "kdfjkdkjf"}/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g`,
                },
            },
        },
    ],
};
//# sourceMappingURL=constants.js.map