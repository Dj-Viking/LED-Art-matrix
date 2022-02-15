/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  IAddPresetResponse,
  IGetUserDefaultPresetResponse,
  IDeletePresetResponse,
} from "../types";
import { User } from "../models";
import { signToken } from "../utils";
const uuid = require("uuid");
readEnv();

const { INVALID_SIGNATURE } = process.env;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URL, {});
});

afterAll(() => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });
  // mongoose.connection.close(() => done());
});
const app = createTestServer();
let newUserId: null | string = null;
let newUserToken: null | string = null;
let defaultPresetId: null | string = null;

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
    const parsed = JSON.parse(user.text) as IGetUserDefaultPresetResponse;
    expect(parsed.preset.presetName).toBe("waves");
    //@ts-ignore
    defaultPresetId = parsed.preset._id;
    expect(parsed.preset.displayName).toBe("waves");
    expect(parsed.preset.animVarCoeff).toBe("64");
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
        _id: defaultPresetId,
        displayName: "waves",
        defaultPreset: "waves",
        animVarCoeff: "23",
      } as IUpdateUserPresetPayload);
    const parsed = JSON.parse(update.text) as IUpdateUserPresetResponse;

    expect(update.status).toBe(200);
    expect(typeof parsed.preset?.presetName).toBe("string");
    expect(parsed.preset._id).toBe(defaultPresetId);
    expect(parsed.preset.presetName).toBe("waves");
    expect(parsed.preset.displayName).toBe("waves");
    expect(parsed.preset.animVarCoeff).toBe("23");
  });

  test("/PUT try to update user preset without a valid token", async () => {
    const invalidSig = await request(app)
      .put("/user/update-preset")
      .set({
        authorization: `Bearer ${INVALID_SIGNATURE}`,
      })
      .send({});
    expect(invalidSig.status).toBe(403);
    const parsed = JSON.parse(invalidSig.text) as IInvalidSigError;
    expect(parsed.error.message).toBe("invalid token");
  });

  test("/POST /user/add-preset add a new preset to the user's preset collection", async () => {
    const add = await request(app)
      .post("/user/add-preset")
      .send({
        displayName: "new preset",
        presetName: "waves",
        animVarCoeff: "55",
      })
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(add.status).toBe(200);
    const parsed = JSON.parse(add.text) as IAddPresetResponse;
    expect(parsed.presets).toHaveLength(7);
    expect(typeof parsed.presets[6]._id).toBe("string");
    expect(parsed.presets[6].animVarCoeff).toBe("55");
    expect(parsed.presets[6].presetName).toBe("waves");
    expect(parsed.presets[6].displayName).toBe("new preset");
  });
  test("/GET /user/presets get user's preset collection", async () => {
    const presets = await request(app)
      .get("/user/presets")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(presets.status).toBe(200);
    const parsed = JSON.parse(presets.text) as IGetUserPresetResponse;
    expect(parsed.presets).toHaveLength(7);
    expect(parsed.presets[6].presetName).toBe("waves");
    expect(parsed.presets[6].displayName).toBe("new preset");
    expect(typeof parsed.presets[6]._id).toBe("string");
    expect(parsed.presets[6].animVarCoeff).toBe("55");
  });
  test("GET /user/presets get user's preset collection without a token", async () => {
    const presets = await request(app).get("/user/presets").set({
      authorization: `Bearer `,
    });
    expect(presets.status).toBe(401);
    const parsed = JSON.parse(presets.text) as { error: string };
    expect(parsed.error).toBe("not authenticated");
  });

  test("DELETE /user/delete-preset delete a user's preset by preset _id", async () => {
    const deleted = await request(app)
      .delete("/user/delete-preset")
      .set({
        authorization: `Bearer ${newUserToken}`,
      })
      .send({
        _id: defaultPresetId as string,
      });
    expect(deleted.status).toBe(200);
    const parsed = JSON.parse(deleted.text) as IDeletePresetResponse;
    expect(parsed.message).toBe("deleted the preset");
  });

  test("test that the user's default preset is reinitialized blank, since the deleted preset was the set default", async () => {
    const user = await request(app)
      .get("/user")
      .set({
        authorization: `Bearer ${newUserToken}`,
      });
    expect(user.status).toBe(200);
    const parsed = JSON.parse(user.text) as IGetUserDefaultPresetResponse;
    expect(parsed.preset.animVarCoeff).toBe("64");
    expect(parsed.preset.presetName).toBe("");
    expect(parsed.preset.displayName).toBe("");
  });

  test("deletes the user we just made", async () => {
    await User.deleteOne({ _id: newUserId as string });
  });
});
