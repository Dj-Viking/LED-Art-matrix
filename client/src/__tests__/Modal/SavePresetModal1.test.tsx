/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/no-unnecessary-act */
//@ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import {
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
    MOCK_SIGN_TOKEN_ARGS,
} from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
// @ts-ignore need to implement a fake version of this for the jest test as expected
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

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));
const originalFetch = global.fetch;
afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
    localStorage.clear();
});

describe("test the save modal functionality", () => {
    //TODO: finish the backend to finally test the api service function that saves the preset
    // to the user's preset collection
    // the app will try to render buttons if we're logged in but if we don't have presets
    // then no buttons will render and the test will fail

    it("tests the modal can have input changing and rendering, click the save button and close button", async () => {
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
            .mockReturnValueOnce(
                fakeFetchRes({
                    preset: {
                        displayName: "",
                        presetName: "waves",
                        animVarCoeff: "64",
                        _id: "6200149468fe291e26584e4d",
                    },
                })
            );
        // @ts-ignore
        global.fetch = mockFetch;
        const history = createMemoryHistory();

        const store = createStore(
            allReducers,
            // @ts-expect-error this will exist in the browser
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        );

        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(typeof localStorage.getItem("id_token")).toBe("string");

        render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        await act(async () => {
            return void 0;
        });

        expect(screen.getByTestId("location-display").textContent).toBe("/");
        //just care about the fetch returning the presets
        // even though the response is also going to the /user endpoint it's irrelevant to this test
        expect(fetch).toHaveBeenCalledTimes(3);
        // expect(fetch).toHaveBeenNthCalledWith(3, "kdjfkjd");

        //open modal
        const savePresetBtn = screen.getByTestId("savePreset");

        act(() => {
            savePresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        //if style display is flex the modal is open
        const styleValues = TestService.getStyles(
            screen.getByTestId("save-modal").parentElement!.style
        );
        expect(styleValues.values.display).toBe("flex");

        const modal_els = {
            close: screen.getByTestId("modal-close-button") as HTMLElement,
            save: screen.getByTestId("modal-save-button") as HTMLElement,
            input: screen.getByTestId("modal-preset-name-input") as HTMLInputElement,
            animVar: screen.getByTestId("modal-anim-var-coeff") as HTMLElement,
        };
        //close for now
        act(() => {
            modal_els.close.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(modal_els.save).toBeDisabled();
        expect(modal_els.input.value).toBe("");
        expect(modal_els.animVar.textContent).toBe("Animation Variation: 64");

        //name input change
        act(() => {
            fireEvent.change(modal_els.input, { target: { value: "heres a name" } });
            modal_els.input.dispatchEvent(TestService.createBubbledEvent("change"));
        });

        expect(modal_els.input.value).toBe("heres a name");
        expect(modal_els.save).not.toBeDisabled();

        //okay somehow using this await will allow the buttons to appear,
        // since they will appear asynchronously because of an API fetch that
        // gets data to then set the state of the presetbuttons array which then renders buttons

        const awaitedButton = await screen.findByTestId("v2");
        expect(awaitedButton.classList).toHaveLength(1);
        expect(awaitedButton.classList[0]).toBe("preset-button-inactive");
        const buttonsParent = screen.getByTestId("buttons-parent");
        expect(buttonsParent.children).toHaveLength(14);

        //start a preset to make the slider appear
        const v2 = await screen.findByTestId("v2");
        act(() => {
            v2.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        //button should be active since we clicked it
        expect(awaitedButton.classList[0]).toBe("preset-button-active");

        // anim var coeff change with slider
        const slider = screen.getByTestId("led-anim-variation");

        act(() => {
            fireEvent.change(slider, { target: { value: "10" } });
            slider.dispatchEvent(TestService.createBubbledEvent("change"));
        });

        expect(modal_els.animVar.textContent).toBe("Animation Variation: 10");

        //click save button
        act(() => {
            modal_els.save.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        //open again
        act(() => {
            savePresetBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        //check text field is empty when opening again
        expect(screen.getByTestId("modal-preset-name-input").textContent).toBe("");

        //click close
        act(() => {
            modal_els.close.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        //test the active/inactive class changing when clicking different preset buttons
        const waves = await screen.findByTestId("waves");
        expect(waves.classList).toHaveLength(1);
        expect(waves.classList[0]).toBe("preset-button-inactive");

        const logout = await screen.findByText(/^Logout$/g);
        expect(logout).toBeInTheDocument();

        await act(async () => {
            logout.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(screen.getByTestId("location-display").textContent).toBe("/");
    });
});
