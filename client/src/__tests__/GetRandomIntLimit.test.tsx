import { getRandomIntLimit } from "../utils/helpers";

describe("tests getRandomIntLimit", () => {
    it("tests the function", () => {
        const result = getRandomIntLimit(1, 10);
        expect(typeof result).toBe("number");
    });
});
