/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../store";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import {
    ASSERT_ANIMATION,
    LOGIN_MOCK_PAYLOAD_USERNAME,
    LOGIN_MOCK_TOKEN,
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
    MOCK_SIGN_TOKEN_ARGS,
} from "../../utils/mocks";
import { TestService } from "../../utils/TestServiceClass";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { mount, ReactWrapper } from "enzyme";
import PresetButtons, { IPresetButtonsProps } from "../../components/PresetButtons";
import {
    ClearButton,
    OpenNewWindowButton,
    SaveDefaultButton,
} from "../../components/PresetButton.style";
import { IDBPreset, PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { setPresetButtonsList } from "../../actions/preset-button-actions";
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

const store = createStore(
    combinedReducers,
    // @ts-expect-error this will exist in the browser
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("test logging in and checking buttons are there", () => {
    //create a reference to the original fetch before we change it swap it back
    const originalFetch = global.fetch;

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
        localStorage.clear();
    });

    it("Checks the input fields are available and can submit with a stubbed api", async () => {
        const fakeFetchRes = (
            value: any
        ): Promise<{
            status: 200;
            json: () => Promise<any>;
        }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
        const mockFetch = jest
            .fn()
            //default
            // .mockReturnValue("kdfjkdj")
            // first
            .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
            // second
            .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
            // third
            .mockReturnValueOnce(
                fakeFetchRes({
                    preset: {
                        displayName: "waves",
                        presetName: "waves",
                        _id: "something",
                    } as IDBPreset,
                })
            );
        // @ts-ignore
        global.fetch = mockFetch;

        const history = createMemoryHistory();
        render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        const page = (await screen.findAllByRole("link", { name: "Login" })).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;
        expect(page).toBeInTheDocument();
        fireEvent.click(page);

        expect(screen.getByTestId("location-display")).toHaveTextContent("/login");

        const inputEls = {
            emailOrUsername: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
            password: screen.getByPlaceholderText(
                /\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g
            ) as HTMLInputElement,
            btn: screen.getAllByRole("button", { name: "Login" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };
        expect(inputEls.emailOrUsername).toBeInTheDocument();
        expect(inputEls.password).toBeInTheDocument();
        expect(inputEls.btn).toBeInTheDocument();

        user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
        user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);

        user.type(inputEls.emailOrUsername, LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
        user.type(inputEls.password, LOGIN_MOCK_PAYLOAD_USERNAME.password);

        await act(async () => {
            inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(screen.getByTestId("location-display")).toHaveTextContent("/");
        expect(localStorage.getItem("id_token")).toBeTruthy();

        expect(fetch).toHaveBeenCalledTimes(4);
        expect(fetch).toHaveBeenNthCalledWith(1, "http://localhost:3001/user/login", {
            body: expect.any(String),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });

        const preset_buttons = {
            clear: screen.getByTestId("clear"),
            rainbowTest: screen.getByTestId("rainbowTest"),
            v2: screen.getByTestId("v2"),
            waves: screen.getByTestId("waves"),
            spiral: screen.getByTestId("spiral"),
            fourSpirals: screen.getByTestId("fourSpirals"),
            dm5: screen.getByTestId("dm5"),
            saveDefault: screen.getByTestId("saveDefault"),
        };

        expect(preset_buttons.clear).toBeInTheDocument();
        expect(preset_buttons.rainbowTest).toBeInTheDocument();
        expect(preset_buttons.v2).toBeInTheDocument();
        expect(preset_buttons.waves).toBeInTheDocument();
        expect(preset_buttons.spiral).toBeInTheDocument();
        expect(preset_buttons.fourSpirals).toBeInTheDocument();
        expect(preset_buttons.dm5).toBeInTheDocument();
        expect(preset_buttons.saveDefault).toBeInTheDocument();
    });

    //WAVES
    it("checks token and test undisabled waves button", async () => {
        const fakeFetchRes = (
            value: any
        ): Promise<{
            status: 200;
            json: () => Promise<any>;
        }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
        const mockFetch = jest
            .fn()
            //default
            // .mockReturnValue("kdfjkdj")
            .mockReturnValueOnce(
                fakeFetchRes({ preset: { displayName: "", presetName: "waves" } })
            );
        // .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }));
        // @ts-ignore
        global.fetch = mockFetch;

        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

        const history = createMemoryHistory();
        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        expect(fetch).toHaveBeenCalledTimes(1);
        // expect(fetch).toHaveBeenNthCalledWith(1, "dkjfdkj");

        const preset_buttons = {
            clear: screen.getByTestId("clear"),
            rainbowTest: await screen.findByTestId("rainbowTest"),
            v2: await screen.findByTestId("v2"),
            waves: await screen.findByTestId("waves"),
            spiral: await screen.findByTestId("spiral"),
            fourSpirals: await screen.findByTestId("fourSpirals"),
            dm5: await screen.findByTestId("dm5"),
            saveDefault: await screen.findByTestId("saveDefault"),
        };

        expect(preset_buttons.clear).toBeInTheDocument();
        expect(preset_buttons.rainbowTest).toBeInTheDocument();
        expect(preset_buttons.v2).toBeInTheDocument();
        expect(preset_buttons.waves).toBeInTheDocument();
        expect(preset_buttons.spiral).toBeInTheDocument();
        expect(preset_buttons.fourSpirals).toBeInTheDocument();
        expect(preset_buttons.dm5).toBeInTheDocument();
        expect(preset_buttons.saveDefault).toBeInTheDocument();
        // get led ref and style tag ref for after the click event and state updates
        let ledPostRef: HTMLElement | null = null;
        let styleTagRef: HTMLStyleElement | null = null;

        act(() => {
            preset_buttons.waves.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(ledPostRef).toBeInTheDocument();
        expect(ledPostRef.classList.length).toBe(1);
        // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
        expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.waves.classListItem);

        styleTagRef = container.querySelector("#led-style");
        expect(typeof styleTagRef).toBe("object");
        expect(!!styleTagRef?.textContent).toBe(true);

        // parse the styleTagRef content to get the animation name and confirm it matches the
        // style in the classlist so therefore the @keyframes animation name should appear
        // in the keyframe matching array
        const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
        const animationNameMatches: string[] | [] = splitTagText
            .map((str) => {
                if (ASSERT_ANIMATION.waves.regex.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string") as string[] | [];

        const keyFramesMatches = animationNameMatches
            .map((str) => {
                if (ASSERT_ANIMATION.keyframes.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string");
        // console.log("key frames arr", keyFramesMatches);

        expect(keyFramesMatches).toHaveLength(1);

        //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
        let clearLedRef = screen.getByTestId("led1-1");
        act(() => {
            preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(clearLedRef).toBeInTheDocument();
        expect(clearLedRef.classList.length).toBe(1);
        // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
        expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);
    });

    //SPIRAL
    it("checks token and test undisabled spiral button", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

        const history = createMemoryHistory();
        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        const preset_buttons = {
            clear: screen.getByTestId("clear"),
            rainbowTest: screen.getByTestId("rainbowTest"),
            v2: screen.getByTestId("v2"),
            waves: screen.getByTestId("waves"),
            spiral: screen.getByTestId("spiral"),
            fourSpirals: screen.getByTestId("fourSpirals"),
            dm5: screen.getByTestId("dm5"),
            saveDefault: screen.getByTestId("saveDefault"),
        };

        expect(preset_buttons.clear).toBeInTheDocument();
        expect(preset_buttons.rainbowTest).toBeInTheDocument();
        expect(preset_buttons.v2).toBeInTheDocument();
        expect(preset_buttons.waves).toBeInTheDocument();
        expect(preset_buttons.spiral).toBeInTheDocument();
        expect(preset_buttons.fourSpirals).toBeInTheDocument();
        expect(preset_buttons.dm5).toBeInTheDocument();
        expect(preset_buttons.saveDefault).toBeInTheDocument();
        // get led ref and style tag ref for after the click event and state updates
        let ledPostRef: HTMLElement | null = null;
        let styleTagRef: HTMLStyleElement | null = null;

        act(() => {
            preset_buttons.spiral.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(ledPostRef).toBeInTheDocument();
        expect(ledPostRef.classList.length).toBe(1);
        // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
        expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.spiral.classListItem);

        styleTagRef = container.querySelector("#led-style");
        expect(typeof styleTagRef).toBe("object");
        expect(!!styleTagRef?.textContent).toBe(true);

        // parse the styleTagRef content to get the animation name and confirm it matches the
        // style in the classlist so therefore the @keyframes animation name should appear
        // in the keyframe matching array
        const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
        const animationNameMatches: string[] | [] = splitTagText
            .map((str) => {
                if (ASSERT_ANIMATION.spiral.regex.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string") as string[] | [];

        const keyFramesMatches = animationNameMatches
            .map((str) => {
                if (ASSERT_ANIMATION.keyframes.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string");
        // console.log("key frames arr", keyFramesMatches);

        expect(keyFramesMatches).toHaveLength(1);

        //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
        let clearLedRef = screen.getByTestId("led1-1");
        act(() => {
            preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(clearLedRef).toBeInTheDocument();
        expect(clearLedRef.classList.length).toBe(1);
        // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
        expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);
    });

    //FOURSPIRALS
    it("checks token and test undisabled fourSpirals button", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

        const history = createMemoryHistory();
        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        const preset_buttons = {
            clear: screen.getByTestId("clear"),
            rainbowTest: screen.getByTestId("rainbowTest"),
            v2: screen.getByTestId("v2"),
            waves: screen.getByTestId("waves"),
            spiral: screen.getByTestId("spiral"),
            fourSpirals: screen.getByTestId("fourSpirals"),
            dm5: screen.getByTestId("dm5"),
            saveDefault: screen.getByTestId("saveDefault"),
        };

        expect(preset_buttons.clear).toBeInTheDocument();
        expect(preset_buttons.rainbowTest).toBeInTheDocument();
        expect(preset_buttons.v2).toBeInTheDocument();
        expect(preset_buttons.waves).toBeInTheDocument();
        expect(preset_buttons.spiral).toBeInTheDocument();
        expect(preset_buttons.fourSpirals).toBeInTheDocument();
        expect(preset_buttons.dm5).toBeInTheDocument();
        expect(preset_buttons.saveDefault).toBeInTheDocument();

        // get led ref and style tag ref for after the click event and state updates
        let ledPostRef: HTMLElement | null = null;
        let styleTagRef: HTMLStyleElement | null = null;

        act(() => {
            preset_buttons.fourSpirals.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(ledPostRef).toBeInTheDocument();
        expect(ledPostRef.classList.length).toBe(1);
        // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
        expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.fourSpirals.classListItem);

        styleTagRef = container.querySelector("#led-style");
        expect(typeof styleTagRef).toBe("object");
        expect(!!styleTagRef?.textContent).toBe(true);

        // parse the styleTagRef content to get the animation name and confirm it matches the
        // style in the classlist so therefore the @keyframes animation name should appear
        // in the keyframe matching array
        const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
        const animationNameMatches: string[] | [] = splitTagText
            .map((str) => {
                if (ASSERT_ANIMATION.fourSpirals.regex.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string") as string[] | [];

        const keyFramesMatches = animationNameMatches
            .map((str) => {
                if (ASSERT_ANIMATION.keyframes.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string");
        // console.log("key frames arr", keyFramesMatches);

        expect(keyFramesMatches).toHaveLength(1);

        //clear preset before next test... not sure how to useDispatch in a jest test, it's probably break rules of hooks.
        let clearLedRef = screen.getByTestId("led1-1");
        act(() => {
            preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(clearLedRef).toBeInTheDocument();
        expect(clearLedRef.classList.length).toBe(1);
        // expect(clearLedRef.classList[0]).toBe("kdjkdfjkdjkf");
        expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);
    });

    //DM5
    it("checks token and test undisabled DM5 button", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(localStorage.getItem("id_token")).toStrictEqual(expect.any(String));

        const history = createMemoryHistory();
        const { container } = render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        const preset_buttons = {
            clear: screen.getByTestId("clear"),
            rainbowTest: screen.getByTestId("rainbowTest"),
            v2: screen.getByTestId("v2"),
            waves: screen.getByTestId("waves"),
            spiral: screen.getByTestId("spiral"),
            fourSpirals: screen.getByTestId("fourSpirals"),
            dm5: screen.getByTestId("dm5"),
            saveDefault: screen.getByTestId("saveDefault"),
        };

        expect(preset_buttons.clear).toBeInTheDocument();
        expect(preset_buttons.rainbowTest).toBeInTheDocument();
        expect(preset_buttons.v2).toBeInTheDocument();
        expect(preset_buttons.waves).toBeInTheDocument();
        expect(preset_buttons.spiral).toBeInTheDocument();
        expect(preset_buttons.fourSpirals).toBeInTheDocument();
        expect(preset_buttons.dm5).toBeInTheDocument();
        expect(preset_buttons.saveDefault).toBeInTheDocument();
        // get led ref and style tag ref for after the click event and state updates
        let ledPostRef: HTMLElement | null = null;
        let styleTagRef: HTMLStyleElement | null = null;

        act(() => {
            preset_buttons.dm5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        ledPostRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(ledPostRef).toBeInTheDocument();
        expect(ledPostRef.classList.length).toBe(1);
        // expect(ledPostRef.classList[0]).toBe("kdjkfjkdjkcj");
        expect(ledPostRef.classList[0]).toBe(ASSERT_ANIMATION.dm5.classListItem);

        styleTagRef = container.querySelector("#led-style");
        expect(typeof styleTagRef).toBe("object");
        expect(!!styleTagRef?.textContent).toBe(true);

        // parse the styleTagRef content to get the animation name and confirm it matches the
        // style in the classlist so therefore the @keyframes animation name should appear
        // in the keyframe matching array
        const splitTagText = styleTagRef?.textContent?.split(/(\r\n|\r|\n)/) as string[];
        const animationNameMatches: string[] | [] = splitTagText
            .map((str) => {
                if (ASSERT_ANIMATION.dm5.regex.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string") as string[] | [];

        const keyFramesMatches = animationNameMatches
            .map((str) => {
                if (ASSERT_ANIMATION.keyframes.test(str)) {
                    return str;
                }
                return void 0;
            })
            .filter((item) => typeof item === "string");
        // console.log("key frames arr", keyFramesMatches);

        expect(keyFramesMatches).toHaveLength(1);

        //clear preset
        let clearLedRef = screen.getByTestId("led1-1");
        act(() => {
            preset_buttons.clear.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        clearLedRef = screen.getByTestId("led1-1") as HTMLElement;
        expect(clearLedRef).toBeInTheDocument();
        expect(clearLedRef.classList.length).toBe(1);
        expect(clearLedRef.classList[0]).toBe(ASSERT_ANIMATION.clearLed);
    });

    it("covers clicking the open new window button and calls the handler that opens the new window in the browser", () => {
        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={store}>
                <PresetButtons />
            </Provider>
        );

        const openNewWindowButton = wrapper.find(OpenNewWindowButton);

        openNewWindowButton.props().handleOpenNewWindow?.({ preventDefault: () => null });
    });
    it("covers clicking the clear button click handler", () => {
        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={store}>
                <PresetButtons />
            </Provider>
        );

        const clearButton = wrapper.find(ClearButton);

        clearButton.props().clickHandler?.({ preventDefault: () => null });
    });

    it("covers clicking the save default button click handler", () => {
        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={store}>
                <PresetButtons />
            </Provider>
        );

        const saveDefaultButton = wrapper.find(SaveDefaultButton);

        saveDefaultButton.props().clickHandler?.({ preventDefault: () => null });
    });
    it("covers clicking the save default button click handler if there is a preset set in global state", () => {
        jest.mock("../../utils/AuthService", () => {
            class fakeService {
                public static getToken(): string | false {
                    // Retrieves the user token from localStorage
                    return "fake token";
                }

                public static loggedIn(): boolean {
                    return true;
                }

                public static isTokenExpired(_token: string): boolean {
                    return false;
                }

                public static login(_token: string): boolean | void {
                    return true;
                }

                public static logout(): void {
                    return void 0;
                }
            }
            return fakeService;
        });
        const fakeFetchRes = (
            value: any
        ): Promise<{
            status: 200;
            json: () => Promise<any>;
        }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
        const mockFetch = jest
            .fn()
            //default
            // .mockReturnValue("kdfjkdj")
            // first
            .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
            // second
            .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }))
            // third
            .mockReturnValueOnce(
                fakeFetchRes({
                    preset: {
                        displayName: "waves",
                        presetName: "waves",
                        _id: "something",
                    } as IDBPreset,
                })
            );
        // @ts-ignore
        global.fetch = mockFetch;

        // set an active preset in the store
        store.dispatch(
            setPresetButtonsList(
                new PresetButtonsList(
                    () => null,
                    [
                        {
                            _id: "someid",
                            animVarCoeff: "0",
                            displayName: "fake preset",
                            presetName: "whatevever",
                        },
                    ],
                    "someid"
                ).getList()
            )
        );

        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={store}>
                <PresetButtons />
            </Provider>
        );

        const saveDefaultButton = wrapper.find(SaveDefaultButton);

        saveDefaultButton.props().clickHandler?.({ preventDefault: () => null });
    });
});
