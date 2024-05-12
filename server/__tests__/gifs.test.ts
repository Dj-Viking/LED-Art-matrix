/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import request from "supertest";
import mongoose from "mongoose";
const uuid = require("uuid");
const { data: base64StringOfWebPImage } = require("../testutils/base64String.json");
import {
    MOCK_GIPHY_RES,
    TEST_DB_URL,
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_USERNAME,
} from "../constants";
import { createTestServer } from "../testServer";
import { ICreateUserPayload, ICreateUserResponse, IGetGifsResponse, IGif } from "../types";

//@ts-ignore
import fetch from "node-fetch";
import { User } from "../models";
import { base64ToBlob_Server } from "../utils/base64ToBlob";

let app: ReturnType<typeof createTestServer>;

let newUserToken = "";
let newUserId = "";

describe("test the CRUD on gifs", () => {
    // test("kjsdfkjfed", () => {
    //     expect(true).toBe(true);
    // });

    // beforeAll(async () => {
    //     await mongoose.connect(TEST_DB_URL).then(() => {
    //         mongoose.connection.db.dropDatabase().then(async () => {
    //             await mongoose.connection.close();
    //         });
    //     });
    // });
    beforeEach(() => {
        app = createTestServer();
    });

    // afterEach(() => {
    //     // @ts-ignore
    //     app = null;
    // });

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URL);
    });

    afterAll(async () => {
        if (newUserId) {
            (async () => {
                await User.deleteOne({ _id: newUserId as string });
            })();
        }
        mongoose.connection.db.dropDatabase().then(async () => {
            await mongoose.connection.close();
        });
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

    test("when array of blobs for gif strings are sent to server\
    can parse those blobs as strings again and then save to database", async () => {
        const fileblob = base64ToBlob_Server(base64StringOfWebPImage, "image/webp");
        const fileBuf = Buffer.from(await fileblob.text());

        const res = await request(app)
            .post("/gifs/saveGifsAsStrings")
            .set({
                authorization: `Bearer ${newUserToken}`,
            })
            .attach("gif image", fileBuf, "test gif");
        expect(res.status).toBe(200);
    });

    test("get gifs and then download the files on the server and then\
    use the files downloaded from the gif links to send to the client", async () => {
        const gifs = await request(app).get("/gifs/getGifsAsDataStrings");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text) as IGetGifsResponse;
        expect(parsed.gifs.length).toBe(1);
        const gif = parsed.gifs[0];
        // it's a really song string so probably greater than 1000 as a base64 blob string
        expect(gif.gifSrcs[0].length).toBeGreaterThan(1000);
    });

    test("get gifs again to replace the previous gifs", async () => {
        const originalFetch = fetch;
        // @ts-ignore [need to assign it!!!!]
        fetch = jest.fn();
        fetch.mockImplementation(() => {
            return Promise.resolve({
                json: () => {
                    return Promise.resolve(MOCK_GIPHY_RES);
                },
            });
        });
        const gifs = await request(app).get("/gifs/unloggedGet");
        expect(gifs.status).toBe(200);
        const parsed = JSON.parse(gifs.text) as IGetGifsResponse;
        expect(parsed.gifs.length).toBe(1);
        const gif = parsed.gifs[0];
        expect(typeof gif._id).toBe("string");
        expect(typeof gif.listName).toBe("string");
        expect(typeof gif.listOwner).toBe("string");
        expect(Array.isArray(gif.gifSrcs)).toBe(true);
        expect(gif.gifSrcs.length).toBeTruthy();

        // @ts-ignore [ set it back to original! ]
        fetch = originalFetch;
    });
});
