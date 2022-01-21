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
} from "../types";
import { User } from "../models";
readEnv();

const { INVALID_SIGNATURE } = process.env;

beforeEach((done) => {
  mongoose.connect(TEST_DB_URL, {}, () => done());
});

afterEach((done) => {
  // mongoose.connection.db.dropDatabase(() => {
  //   mongoose.connection.close(() => done());
  // });
  mongoose.connection.close(() => done());
});
const app = createTestServer();
let newUserId: null | string = "";
let newUserToken: null | string = "";

describe("test this runs through CRUD of a user entity", () => {
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

  test("/POST this new user can now login", async () => {
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

  test("/PUT update a user's default preset", async () => {
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
