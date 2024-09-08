/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from "@jest/types";
import { defaults } from "jest-config";

import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { INITIAL_GAIN } from "./constants";

Enzyme.configure({ adapter: new Adapter() });

//letting these methods be available to silence the jest errors
window.HTMLMediaElement.prototype.load = () => {
    /* do nothing */
};
window.HTMLMediaElement.prototype.play = async () => {
    /* do nothing */
};
window.HTMLMediaElement.prototype.pause = () => {
    /* do nothing */
};
// eslint-disable-next-line
// @ts-ignore
window.HTMLMediaElement.prototype.addTextTrack = () => {
    /* do nothing */
};

// stub canvas element
// @ts-ignore
window.HTMLCanvasElement.prototype.getContext = () => {
    // @ts-ignore
    return {
        canvas: {
            width: 420,
            height: 69,
        },
        fillStyle: "",
        fill: () => {
            //
        },
        beginPath: () => {
            //
        },
        roundRect: () => {
            //
        },
        clearRect: () => {
            //
        },
        closePath: () => {
            //
        },
    };
};

window.open = () => null;

// @ts-ignore
window.indexedDB = {
    // @ts-ignore
    open: async () =>
        // @ts-ignore
        new Promise<IDBOpenDBRequest>((res) =>
            // @ts-ignore
            res({
                onblocked: null,
                onupgradeneeded: function (this: IDBOpenDBRequest, _ev: Event) {
                    return {};
                },
                addEventListener: function () {
                    return {};
                },
                removeEventListener: function () {
                    return {};
                },
                onsuccess: function () {
                    return void 0;
                },
            })
        ),
};

// @ts-ignore
const GainNodeProto: typeof GainNode.prototype = {
    connect: () => ({} as any), 
    gain: { value: INITIAL_GAIN } as any
};

// @ts-ignore
const MockGainNodeClass = class { constructor() {} };
Object.setPrototypeOf(MockGainNodeClass, GainNodeProto);
// @ts-ignore
window.GainNode = MockGainNodeClass;

// @ts-ignore
const AnalyserNodeProto: typeof AnalyserNode.prototype = {
    "connect": () => ({} as any),
    "frequencyBinCount": 1024,
    "fftSize": 2048,
    "getFloatFrequencyData": () => new Float32Array(1024)
};

const MockAnalyserClass = class { constructor() {} };
Object.setPrototypeOf(MockAnalyserClass, AnalyserNodeProto);
// @ts-ignore
window.AnalyserNode = MockAnalyserClass;

// @ts-ignore
const AudioContextProto: typeof AudioContext.prototype = {
    "createGain": () => new MockGainNodeClass() as any,
    "createAnalyser": () => new MockAnalyserClass() as any
};
// @ts-ignore
window.AudioContext = class { constructor() {} };
Object.setPrototypeOf(window.AudioContext, AudioContextProto);

export async function MyConfig(): Promise<Config.InitialOptions> {
    return {
        verbose: true,
        watchAll: true,
        testEnvironment: "jsdom",
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
