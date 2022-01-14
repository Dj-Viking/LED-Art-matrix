import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverage: true,
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
