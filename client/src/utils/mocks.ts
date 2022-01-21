// import { rest } from "msw";
// import { setupServer } from "msw/node";

export const SAVE_DEFAULT_MOCK_SUCCESS = {
  updated: "presetName goes here hahahah"
};
export const SAVE_DEFAULT_MOCK_ERROR = {
  error: "ERROR"
};

export const ASSERT_ANIMATION = {
  clearLed: "led1-1",
  keyframes: /keyframes/g,
  rainbowTest: {
    regex: /rainbowTestAllAnim/g,
    classListItem: "led1-1rainbowTestAllAnim"
  },
  v2: {
    regex: /V2/g,
    classListItem: "led1-1V2",
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

export const LOGIN_MOCK_RESPONSE = {
  _id: "kdjfkdfj",
  token: "token man",
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

export const LOGIN_MOCK_TOKEN = {
  user:  {
    token: "TOKEN YO",
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
  token: "heres a token",
  _id: "heres an id"
};
// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// export const server = setupServer(
//   rest.post("http://localhost:3001/user", async (_req, res, ctx) => {
//     return res(ctx.json(SIGNUP_MOCK_RESULT));
//   })
// );