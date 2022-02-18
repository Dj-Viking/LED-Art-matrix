// import { rest } from "msw";
// import { setupServer } from "msw/node";
import jwt from "jsonwebtoken";
import { keyGen } from "./keyGen";
const uuid = require("uuid");

export const SAVE_DEFAULT_MOCK_SUCCESS = {
  preset: {
    presetName: "new preset yo",
    animVarCoeff: "74",
  },
};
export const SAVE_DEFAULT_MOCK_ERROR = {
  error: "ERROR"
};
export const MOCK_SIGN_TOKEN_ARGS = {
  username: "test user",
  email: "test email",
  uuid: uuid.v4(),
  _id: keyGen(),
};
export const MOCK_PRESETS = [
  {displayName: "", presetName: "rainbowTest", animVarCoeff: "64", _id: "6200149468fe291e26584e4b"},
  {displayName: "", presetName: "v2", animVarCoeff: "64", _id: "6200149468fe291e26584e4c"},
  {displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d"},
  {displayName: "", presetName: "spiral", animVarCoeff: "64", _id: "6200149468fe291e26584e4e"},
  {displayName: "", presetName: "fourSpirals", animVarCoeff: "64", _id: "6200149468fe291e26584e4f"},
  {displayName: "", presetName: "dm5", animVarCoeff: "64", _id: "6200149468fe291e26584e50"},
  {displayName: "bogus", presetName: "bogus", animVarCoeff: "64", _id: "6200149468fe291e26584e51"},
];
export const MOCK_ADD_PRESET_RES = [
  {displayName: "", presetName: "rainbowTest", animVarCoeff: "64", _id: "6200149468fe291e26584e4b"},
  {displayName: "", presetName: "v2", animVarCoeff: "64", _id: "6200149468fe291e26584e4c"},
  {displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d"},
  {displayName: "", presetName: "spiral", animVarCoeff: "64", _id: "6200149468fe291e26584e4e"},
  {displayName: "", presetName: "fourSpirals", animVarCoeff: "64", _id: "6200149468fe291e26584e4f"},
  {displayName: "", presetName: "dm5", animVarCoeff: "64", _id: "6200149468fe291e26584e50"},
  {displayName: "bogus", presetName: "bogus", animVarCoeff: "64", _id: "6200149468fe291e26584e51"},
  {displayName: "new preset", presetName: "new preset", animVarCoeff: "64", _id: "6200149468fe291e26584e53"},
];


export const ASSERT_ANIMATION = {
  clearLed: "led1-1",
  keyframes: /keyframes/g,
  durationStyleRegex: /animation-duration: ([0-9.s])+/,
  delayStyleRegex: /animation-delay: ([0-9.s])+/,
  rainbowTest: {
    regex: /rainbowTest/g,
    classListItem: "led1-1rainbowTest",
  },
  v2: {
    regex: /v2/g,
    classListItem: "led1-1v2",
  },
  waves: {
    regex: /waves/g,
    classListItem: "led1-1waves",
    
  },
  spiral: {
    regex: /spiral/g,
    classListItem: "led1-1spiral"
  },
  fourSpirals: {
    regex: /fourSpirals/g,
    classListItem: "led1-1fourSpirals"
  },
  dm5: {
    regex: /dm5/g,
    classListItem: "led1-1dm5"
  },
};

export const CHANGE_PASS_MOCK_RES = {
  message: "success",
  done: true,
  token: "HERES A TOKEN YAY"
};

export const CHANGE_PASS_INPUT_MATCH = {
  newPass: "newer password",
  confirmPass: "newer password"
};
export const CHANGE_PASS_INPUT_NOT_MATCH = {
  newPass: "newer password",
  confirmPass: "newer password1"
};

export const LOGIN_MOCK_PAYLOAD_USERNAME = {
  emailOrUsername: "i exist",
  password: "believe it"
};

export const LOGIN_MOCK_PAYLOAD_EMAIL = {
  emailOrUsername: "iexist@exist.com",
  password: "believe it"
};
export const EXPIRED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lVXVpZCI6IjcxNmYzMzJlLTMxODQtNDJmMC04Y2I3LTRjOWNlNmJmODdkOCIsInVzZXJuYW1lIjoidGVzdC11c2VyIiwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsIl9pZCI6IjYxZTIxMzgwNTdjOTc4NGYyNDllNjIzNSIsImlhdCI6MTY0MjIwNjA4MCwiZXhwIjoxNjQyMjA5NjgwfQ.kShMP7vYDqYvw-raT1WUq1_XVD4LgU9YsJBZ_8qAqpM";

export const LOGIN_MOCK_RESPONSE = {
  _id: "kdjfkdfj",
  token: "dkfdkj",
  defaultPreset: "waves"
};

export const LOGIN_MOCK_ERROR_CODE = {
  status: 400,
  error: new Error("Invalid credentials")
};

export const LOGIN_MOCK_NO_TOKEN = {
  user:  {
    token: void 0,
    _id: "weeeeeeeee"
  }
};


// TODO: sign a new token!!
export const LOGIN_MOCK_TOKEN = {
  user:  {
    token: jwt.sign({
      username: "weeeee",
      _id: "weeeeeee",
    }, "SECRET!!!!", { expiresIn: "1h" }),
    _id: "weeeeeeeee"
  }
};

export const FORGOT_MOCK_INPUT = {
  email: "test@email.com"
};

export const FORGOT_MOCK_RES = {
  message: "success"
};

export const FORGOT_MOCK_RES_ERROR = {
  status: 500,
};

export const SIGNUP_MOCK_ERROR = {};

export const SIGNUP_MOCK_PAYLOAD_SAME_USER = {
  username: "test user",
  email: "testemail@email.com",
  password: "test password",
};

export const SIGNUP_MOCK_PAYLOAD = {
  username: "test user" + Date.now(),
  email: "testemail" + Date.now() + "@email.com",
  password: "test password" + Date.now(),
};

export const SIGNUP_MOCK_RESULT = {
  token: jwt.sign({
    username: "weeeee",
    _id: "weeeeeee",
  }, "SECRET!!!!", { expiresIn: "1h" }),
  _id: "heres an id"
};

// with msw (mock service worker)
// export const server = setupServer(
//   rest.post("http://localhost:3001/user", async (_req, res, ctx) => {
//     return res(ctx.json(SIGNUP_MOCK_RESULT));
//   })
// );