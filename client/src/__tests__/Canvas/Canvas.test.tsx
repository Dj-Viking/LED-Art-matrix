/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/no-debugging-utils */
// eslint-disable-next-line
// @ts-ignore
import React, { DOMAttributes } from "react";
import { Provider } from "react-redux";
import { mount, ReactWrapper } from "enzyme";
// @ts-ignore
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { toolkitStore } from "../../store/store";
import { Canvas } from "../../components/Canvas";
import { act } from "@testing-library/react";

// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
window.navigator.requestMIDIAccess = async function (): Promise<MIDIAccessRecord> {
    return Promise.resolve({
        inputs: MOCK_ACCESS_INPUTS,
        outputs: MOCK_ACCESS_OUTPUTS,
        sysexEnabled: false,
        onstatechange: function (_event: MIDIConnectionEvent): void {
            return void 0;
        },
    } as MIDIAccessRecord);
};

describe("<Canvas />", () => {
    beforeEach(() => {
        //
    });

    it("canvas renders", async () => {
        // Setup
        /**
         * to override window stuff check this...pretty complicated AF
         * @see https://www.npmjs.com/package/jest-wrap
         */
        // const originalWindow = global.window;
        // Object.defineProperty(global, "window", {
        //     value: {
        //         ...originalWindow,
        //         onresize: () => {
        //             //
        //         },
        //         onload: () => {
        //             //
        //         },
        //     },
        //     writable: true,
        // });

        await act(async () => {
            const canvasWrapper = await new Promise<ReactWrapper<DOMAttributes<HTMLCanvasElement>>>((resolve) =>
                resolve(
                    mount(
                        <Provider store={toolkitStore}>
                            <Canvas />
                        </Provider>
                    )
                )
            );

            console.log("canvas wrapper", canvasWrapper.debug());
            const canvasEl = canvasWrapper.find("#canvas");
            console.log("canvas wrapper", canvasEl.debug());
        });
    });
});
