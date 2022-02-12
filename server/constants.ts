require("dotenv").config();
export const TEST_DB_URL = "mongodb://localhost/led-matrix-test";
export const IS_PROD = process.env.NODE_ENV === "production";
export const APP_DOMAIN_PREFIX = IS_PROD
  ? "https://led-matrices.herokuapp.com"
  : "http://localhost:3000";
export const TEST_USERNAME = "test-user";
export const TEST_EMAIL = "test@email.com";
export const TEST_PASSWORD = "test password";
export const INITIAL_PRESETS = [
  {
    presetName: "rainbowTest",
  },
  {
    presetName: "v2",
  },
  {
    presetName: "waves",
  },
  {
    presetName: "spiral",
  },
  {
    presetName: "fourSpirals",
  },
  {
    presetName: "dm5",
  },
];

export const MOCK_GIPHY_RES = {
  data: [
    {
      images: {
        original: {
          url: `https://media2.giphy.com/media/${
            (Math.random() * 1000).toString() + "kdjfdkjkj"
          }/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g`,
        },
      },
    },
    {
      images: {
        original: {
          url: `https://media2.giphy.com/media/${
            (Math.random() * 1000).toString() + "kdfjkdkjf"
          }/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g`,
        },
      },
    },
  ],
} as {
  data: Array<{
    images: {
      original: {
        url: string;
      };
    };
  }>;
};
