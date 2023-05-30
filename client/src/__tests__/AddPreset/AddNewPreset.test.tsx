/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { TestService } from "../../utils/TestServiceClass";
import {
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_ADD_PRESET_RES,
    MOCK_PRESETS,
    MOCK_SIGN_TOKEN_ARGS,
} from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { toolkitStore } from "../../store/store";

// stub the keydown event because jest test will not work properly with the react app containing window.eventListener("keyup") listener callbacks
const map = {} as Record<any, any>;
window.addEventListener = jest.fn((event, cb) => {
    map[event as any] = cb;
});

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

describe("Adding a preset", () => {
    it.only("tests the add preset function runs", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

        const fakeFetchRes = (
            value: any
        ): Promise<{
            status: 200;
            json: () => Promise<any>;
        }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
        const mockFetch = jest
            .fn()
            .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
            .mockReturnValueOnce(
                fakeFetchRes({
                    preset: {
                        displayName: "",
                        presetName: "waves",
                        animVarCoeff: "64",
                        _id: "6200149468fe291e26584e4d",
                    },
                })
            )
            .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_ADD_PRESET_RES }));
        // @ts-ignore
        global.fetch = mockFetch;

        const history = createMemoryHistory();
        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Provider>
            </>
        );
        expect(screen.getByTestId("location-display").textContent).toBe("/");
        expect(fetch).toHaveBeenCalledTimes(1);
        const btnContainer = await screen.findByTestId("buttons-parent");
        expect(btnContainer.children).toHaveLength(13);

        // activate and change one of the constant/always provided presets and
        // attempt to save it with some new parameter values
        const waves = await screen.findByTestId("waves");
        expect(waves).toBeInTheDocument();

        const modal_els = {
            close: await screen.findByTestId("modal-close-button"),
            save: await screen.findByTestId("modal-save-button"),
            input: await screen.findByTestId("modal-preset-name-input"),
            sliderVal: await screen.findByTestId("modal-anim-var-coeff"),
        };

        act(() => {
            waves.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(modal_els.save).toBeInTheDocument();
        expect(modal_els.sliderVal).toBeInTheDocument();

        //open the save preset modal
        const openSavePresetModalBtn = await screen.findByTestId("savePreset");
        expect(openSavePresetModalBtn).toBeInTheDocument();

        //type in the name of the preset
        act(() => {
            user.type(modal_els.input, "new preset");
            modal_els.input.dispatchEvent(TestService.createBubbledEvent("change"));
        });

        expect(modal_els.save).not.toBeDisabled();

        await act(async () => {
            modal_els.save.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenNthCalledWith(3, "http://localhost:3001/user/add-preset", {
            body: expect.any(String),
            headers: {
                "Content-Type": "application/json",
                authorization: expect.any(String),
            },
            method: "POST",
        });

        expect((await screen.findByTestId("buttons-parent")).children).toHaveLength(9);
        const newPresetBtn = await screen.findByText(/new preset/);
        expect(newPresetBtn).toBeInTheDocument();

        //click the new button for coverage
        act(() => {
            newPresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        });
    });
});
