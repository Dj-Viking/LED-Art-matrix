/* eslint-disable @typescript-eslint/ban-ts-comment */
import { signToken } from "../utils/signToken";

describe("test if incorrect args were sent to signToken", () => {
  test("check if signToken didn't get right args", () => {
    // @ts-ignore
    const token = signToken({});
    expect(typeof token).toBe("string");
    expect(token).toBe(
      "couldn't create a token from the input args in signToken, one of the properties in the args input object was possibly null or undefined"
    );
  });
});
