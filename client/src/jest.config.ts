import type { Config } from "@jest/types";
import { defaults } from "jest-config";

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

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