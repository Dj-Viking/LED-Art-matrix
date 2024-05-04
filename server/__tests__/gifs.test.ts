/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import request from "supertest";
import mongoose from "mongoose";
import { MOCK_GIPHY_RES, TEST_DB_URL } from "../constants";
import { createTestServer } from "../testServer";
import { IGetGifsResponse } from "../types";

jest.mock("node-fetch");
//@ts-ignore
import fetch from "node-fetch";

const mockedFetch: jest.Mock<typeof fetch> = fetch as any;

mockedFetch.mockImplementation(() => {
    return Promise.resolve({
        json: () => {
            return Promise.resolve(MOCK_GIPHY_RES);
        },
    });
});

const app = createTestServer();

describe("test the CRUD on gifs", () => {
    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URL);
    });

    afterAll(async () => {
        mongoose.connection.db.dropDatabase().then(async () => {
            await mongoose.connection.close();
        });
    });

    test("get gifs again to replace the previous gifs", async () => {
        const gifs = await request(app).get("/gifs/unloggedGet");
        expect(gifs.status).toBe(200);
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        const parsed = JSON.parse(gifs.text) as IGetGifsResponse;
        expect(parsed.gifs.length).toBe(1);
        const gif = parsed.gifs[0];
        expect(typeof gif._id).toBe("string");
        expect(typeof gif.listName).toBe("string");
        expect(typeof gif.listOwner).toBe("string");
        expect(Array.isArray(gif.gifSrcs)).toBe(true);
        expect(gif.gifSrcs.length).toBeTruthy();
    });
});
