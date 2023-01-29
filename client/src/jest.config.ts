import type { Config } from "@jest/types";
import { defaults } from "jest-config";

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

export async function MyConfig(): Promise<Config.InitialOptions> {
  return {
    verbose: true,
    watchAll: true,
    // restoreMocks: true, // even with this, jest mocks are still leaking into other tests!!!!
    // clearMocks: true,
    // resetMocks: true,
    modulePaths: ["<rootDir>"],
    transformIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/**/*.js"],
    testMatch: ["**/?(*.)+(spec|test).tsx"],
    moduleFileExtensions: [...defaults.moduleFileExtensions, "tsx", "jsx", "ts"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  };
}