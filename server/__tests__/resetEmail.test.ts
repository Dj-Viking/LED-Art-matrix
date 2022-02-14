import request from "supertest";
import mongoose from "mongoose";
import { readEnv } from "../utils/readEnv";
import { TEST_DB_URL, TEST_EMAIL, TEST_PASSWORD, TEST_USERNAME } from "../constants";
import { createTestServer } from "../testServer";
import { ICreateUserPayload, ICreateUserResponse, IForgotPasswordResponse } from "../types";
import { User } from "../models";
readEnv();

import defaultExport, { bar, foo } from "../__mocks__/stubs/foo-bar-baz";
//mock the sendEmail function so it doesn't send an email during a test
import { sendEmail } from "../utils/sendEmail";
jest.mock("../utils/sendEmail.ts");

jest.mock("../__mocks__/stubs/foo-bar-baz", () => {
  const originalModule = jest.requireActual("../__mocks__/stubs/foo-bar-baz");

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "mocked baz"),
    foo: "mocked foo",
  };
});

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URL, {});
});

afterAll(async () => {
  mongoose.connection.db.dropDatabase(async () => {
    await mongoose.connection.close();
  });

  // mongoose.connection.close(() => done());
});

//test.js
const app = createTestServer();
let newUserId: null | string = "";

describe("test the reset email function gets actually called but doesn't send an email", () => {
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
  });

  test("/POST try to send good email but doesn't exist", async () => {
    const badEmail = await request(app).post("/user/forgot").send({
      email: "dkfjkdjkf@dkjfdkj.com",
    });
    expect(badEmail.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(0); //stubbed
    const parsed = JSON.parse(badEmail.text);
    expect(parsed.message).toBe("success");
  });

  test("/POST try to send bad email", async () => {
    const badEmail = await request(app).post("/user/forgot").send({
      email: "dkfjkdjkf",
    });
    expect(badEmail.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(0); //stubbed
    const parsed = JSON.parse(badEmail.text);
    expect(parsed.message).toBe("success");
  });

  test("/POST test dispatch user reset email func gets called", async () => {
    const forgotPassword = await request(app).post("/user/forgot").send({
      email: TEST_EMAIL,
    });
    expect(forgotPassword.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1); //stubbed
    const parsed = JSON.parse(forgotPassword.text) as IForgotPasswordResponse;
    expect(parsed.message).toBe("success");
  });

  test("should do a partial mock", () => {
    const defaultExportResult = defaultExport();
    expect(defaultExportResult).toBe("mocked baz");
    expect(defaultExport).toHaveBeenCalled();
    expect(foo).toBe("mocked foo");
    expect(bar()).toBe("bar");
  });

  test("deletes the user we just made", async () => {
    await User.deleteOne({ _id: newUserId as string });
  });
});
