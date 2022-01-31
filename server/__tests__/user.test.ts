import request from "supertest";
import mongoose from "mongoose";
import { readEnv } from "../utils/readEnv";
import { TEST_DB_URL, TEST_EMAIL, TEST_PASSWORD, TEST_USERNAME } from "../constants";
import { createTestServer } from "../testServer";
import {
  ICreateUserPayload,
  ICreateUserResponse,
  IInvalidSigError,
  ILoginPayload,
  ILoginResponse,
  IUpdateUserPresetPayload,
  IUpdateUserPresetResponse,
  IGetUserPresetResponse,
} from "../types";
import { User } from "../models";
import { signToken } from "../utils";
const uuid = require("uuid");
readEnv();

const { INVALID_SIGNATURE } = process.env;

beforeAll((done) => {
  mongoose.connect(TEST_DB_URL, {}, () => done());
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
  // mongoose.connection.close(() => done());
});
const app = createTestServer();
let newUserId: null | string = "";
let newUserToken: null | string = "";

describe("test this runs through CRUD of a user entity", () => {
  test("POST /user try to sign up with out data", async () => {
    const user = await request(app).post("/user");
    expect(user.status).toBe(400);
    expect(JSON.parse(user.text).error).toBe(
      "missing username, email, or password in the signup request."
    );
  });

  test("/POST a user gets created", async () => {
    const createUser = await request(app)
      .post("/user")
      .send({
        username: TEST_USERNAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      } as ICreateUserPayload);

    const parsed = JSON.parse(createUser.text) as ICreateUserResponse;
    expect(createUser.status).toBe(201);
    expect(typeof parsed._id).toBe("string");
    newUserId = parsed._id;
    expect(typeof parsed.token).toBe("string");
    newUserToken = parsed.token;
  });

  test("GET /user get the user info and their default preset", async () => {
    const user = await request(app)
      .get("/user")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(user.status).toBe(200);
    const parsed = JSON.parse(user.text) as IGetUserPresetResponse;
    expect(parsed.preset).toBe("waves");
  });

  test("POST /user/login with just email", async () => {
    const login = await request(app)
      .post("/user/login")
      .send({
        usernameOrEmail: {
          username: void 0,
          email: TEST_EMAIL,
        },
        password: TEST_PASSWORD,
      } as ILoginPayload);
    expect(login.status).toBe(200);
  });

  test("POST /user/login try to login with bad password", async () => {
    const badPass = await request(app)
      .post("/user/login")
      .send({
        usernameOrEmail: {
          username: TEST_USERNAME,
          email: void 0,
        },
        password: "dkjfkdjfk",
      });
    expect(badPass.status).toBe(400);
    expect(JSON.parse(badPass.text).error).toBe("Incorrect Credentials");
  });

  test("POST /user/login try to login with wrong credentials", async () => {
    const badCreds = await request(app)
      .post("/user/login")
      .send({
        usernameOrEmail: {
          username: void 0,
          email: void 0,
        },
        password: TEST_PASSWORD,
      });
    expect(badCreds.status).toBe(400);
    expect(JSON.parse(badCreds.text).error).toBe("Incorrect Credentials");
  });

  test("POST /user/login this new user can now login", async () => {
    const login = await request(app)
      .post("/user/login")
      .send({
        usernameOrEmail: {
          username: TEST_USERNAME,
          email: void 0,
        },
        password: TEST_PASSWORD,
      } as ILoginPayload);
    const parsed = JSON.parse(login.text) as ILoginResponse;
    expect(login.status).toBe(200);
    expect(typeof parsed.user.token).toBe("string");
    expect(parsed.user.token !== newUserToken).toBe(true);
  });

  test("PUT /change-pass user attempt to change password with bad token", async () => {
    //sign a reset email token
    let resetToken = signToken({
      resetEmail: TEST_EMAIL,
      uuid: uuid.v4(),
      exp: "5m",
    });
    resetToken += resetToken.replace(resetToken[0], "kdjkfdjfdk");
    const change = await request(app).put("/user/change-pass").send({
      password: "new password",
      token: resetToken,
    });
    expect(change.status).toBe(403);
  });

  test("PUT /change-pass user attempt to change password with bad email", async () => {
    //sign a reset email token
    const resetToken = signToken({
      resetEmail: "kdfjkdkfj@dkfjdkjf.com",
      uuid: uuid.v4(),
      exp: "5m",
    });
    const badEmail = await request(app).put("/user/change-pass").send({
      password: "new password",
      token: resetToken,
    });
    expect(badEmail.status).toBe(400);
  });

  test("PUT /change-pass user attempt to change password", async () => {
    //sign a reset email token
    const resetToken = signToken({
      resetEmail: TEST_EMAIL,
      uuid: uuid.v4(),
      exp: "5m",
    });
    const change = await request(app).put("/user/change-pass").send({
      password: "new password",
      token: resetToken,
    });
    expect(change.status).toBe(200);
    expect(JSON.parse(change.text).done).toBe(true);
    expect(typeof JSON.parse(change.text).token).toBe("string");
  });

  test("POST /user/login with the new password", async () => {
    const reset = await request(app)
      .post("/user/login")
      .send({
        usernameOrEmail: {
          username: TEST_USERNAME,
        },
        password: "new password",
      } as ILoginPayload);
    expect(reset.status).toBe(200);
  });

  test("PUT /update-preset try update preset without data", async () => {
    const update = await request(app)
      .put("/user/update-preset")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(update.status).toBe(400);
    expect(JSON.parse(update.text).error).toBe("missing preset name in request");
  });

  test("PUT /update-preset a user's default preset", async () => {
    const update = await request(app)
      .put("/user/update-preset")
      .set({
        authorization: `Bearer ${newUserToken}`,
      })
      .send({
        defaultPreset: "waves",
      } as IUpdateUserPresetPayload);
    const parsed = JSON.parse(update.text) as IUpdateUserPresetResponse;

    expect(update.status).toBe(200);
    expect(typeof parsed.updated).toBe("string");
    expect(parsed.updated).toBe("waves");
  });

  test("/PUT try to update preset with invalid token", async () => {
    const invalidSig = await request(app)
      .put("/user/update-preset")
      .set({
        authorization: `Bearer ${INVALID_SIGNATURE}`,
      })
      .send({
        usernameOrEmail: {
          username: TEST_USERNAME,
          email: "",
        },
        password: TEST_PASSWORD,
      } as ILoginPayload);
    expect(invalidSig.status).toBe(403);
    const parsed = JSON.parse(invalidSig.text) as IInvalidSigError;
    expect(parsed.error.message).toBe("invalid token");
  });

  // TODO: TEST USER EMAIL RESET STUB

  test("deletes the user we just made", async () => {
    await User.deleteOne({ _id: newUserId as string });
  });
});
