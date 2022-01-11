import type { Config } from "@jest/types";
import { defaults } from "jest-config";
export async function MyConfig(): Promise<Config.InitialOptions> {
  return {
    verbose: true,
    watchAll: true,
    modulePaths: ["<rootDir>"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: ["**/?(*.)+(spec|test).tsx"],
    moduleFileExtensions: [...defaults.moduleFileExtensions, "tsx", "jsx", "ts"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  };
}