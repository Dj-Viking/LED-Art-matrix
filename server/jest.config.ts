import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverageFrom: [
      "!utils/sendEmail.ts",
      "!dist/*.js",
      "!dist/**/*.js",
      "!coverage/*",
      "!index.ts",
      "!constants.ts",
      "!./config/*",
      "!jest.config.ts",
      "!./stubs/*",
    ],
    coverageReporters: ["json", "html"],
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
    // need this module paths set to this to run tests in github actions workflow
    // otherwise some imports can't be resolved
    modulePaths: ["<rootDir>"],
    // testMatch: ["**/?(*.)+(spec|test).js"],
    // watchPathIgnorePatterns: [".+(spec|test).ts"]
  };
};
