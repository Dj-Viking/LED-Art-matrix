"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signToken_1 = require("../utils/signToken");
describe("test if incorrect args were sent to signToken", () => {
    test("check if signToken didn't get right args", () => {
        const token = (0, signToken_1.signToken)({});
        expect(typeof token).toBe("string");
        expect(token).toBe("couldn't create a token from the input args in signToken, one of the properties in the args input object was possibly null or undefined");
    });
});
//# sourceMappingURL=signToken.test.js.map