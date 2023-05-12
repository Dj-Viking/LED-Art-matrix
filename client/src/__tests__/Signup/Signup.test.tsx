// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../store";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import {
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
    MOCK_PRESETS,
    SIGNUP_MOCK_ERROR,
    SIGNUP_MOCK_PAYLOAD,
    SIGNUP_MOCK_RESULT,
} from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
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

const store = createStore(
    combinedReducers,
    // @ts-expect-error this will exist in the browser
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

describe("Tests network error message", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
        localStorage.clear();
    });

    it("Checks the input fields are available and can submit with a stubbed api", async () => {
        // @ts-ignore trying to mock fetch
        global.fetch = jest.fn(() =>
            Promise.reject({
                message: new Error("network is down").message,
            })
        );
        const history = createMemoryHistory();

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

        const page = (await screen.findAllByRole("link", { name: "Sign Up" })).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;
        expect(page).toBeInTheDocument();
        fireEvent.click(page);

        const formEls = {
            username: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
            email: screen.getByPlaceholderText(/example@email.com/g) as HTMLInputElement,
            password: screen.getByPlaceholderText(
                /\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g
            ) as HTMLInputElement,
            btn: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };
        //check the input elements are in the document
        expect(formEls.username).toBeInTheDocument();
        expect(formEls.email).toBeInTheDocument();
        expect(formEls.password).toBeInTheDocument();
        expect(formEls.btn).toBeInTheDocument();

        user.type(formEls.username, SIGNUP_MOCK_PAYLOAD.username);
        user.type(formEls.email, SIGNUP_MOCK_PAYLOAD.email);
        user.type(formEls.password, SIGNUP_MOCK_PAYLOAD.password);
        expect(formEls.username.value).toBe(SIGNUP_MOCK_PAYLOAD.username);
        expect(formEls.email.value).toBe(SIGNUP_MOCK_PAYLOAD.email);
        expect(formEls.password.value).toBe(SIGNUP_MOCK_PAYLOAD.password);

        await act(async () => {
            formEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("location-display")).toHaveTextContent("/signup");
    });
});

describe("need to impl window.location.assign()", () => {
    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it("app tries to redirect after successful signup", async () => {
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
            .mockReturnValueOnce(fakeFetchRes(SIGNUP_MOCK_RESULT))
            .mockReturnValueOnce(fakeFetchRes({ preset: { displayName: "", presetName: "waves" } }))
            .mockReturnValueOnce(fakeFetchRes({ presets: MOCK_PRESETS }));
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

        const page = (await screen.findAllByRole("link", { name: "Sign Up" })).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;
        expect(page).toBeInTheDocument();
        fireEvent.click(page);

        expect(screen.getByTestId("location-display")).toHaveTextContent("/signup");

        const formEls = {
            username: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
            email: screen.getByPlaceholderText(/example@email.com/g) as HTMLInputElement,
            password: screen.getByPlaceholderText(
                /\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g
            ) as HTMLInputElement,
            btn: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };

        //check the input elements are in the document
        expect(formEls.username).toBeInTheDocument();
        expect(formEls.email).toBeInTheDocument();
        expect(formEls.password).toBeInTheDocument();
        expect(formEls.btn).toBeInTheDocument();

        // type inputs to form fields and submit

        user.type(formEls.username, SIGNUP_MOCK_PAYLOAD.username);
        user.type(formEls.email, SIGNUP_MOCK_PAYLOAD.email);
        user.type(formEls.password, SIGNUP_MOCK_PAYLOAD.password);

        user.clear(formEls.username);
        user.clear(formEls.email);
        user.clear(formEls.password);
        expect(formEls.username.value).toBe("");
        expect(formEls.email.value).toBe("");
        expect(formEls.password.value).toBe("");

        user.type(formEls.username, SIGNUP_MOCK_PAYLOAD.username);
        user.type(formEls.email, SIGNUP_MOCK_PAYLOAD.email);
        user.type(formEls.password, SIGNUP_MOCK_PAYLOAD.password);
        expect(formEls.username.value).toBe(SIGNUP_MOCK_PAYLOAD.username);
        expect(formEls.email.value).toBe(SIGNUP_MOCK_PAYLOAD.email);
        expect(formEls.password.value).toBe(SIGNUP_MOCK_PAYLOAD.password);

        //click signup to simulate api mock

        await act(async () => {
            formEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(2);
        // expect(fetch).toHaveBeenNthCalledWith(2, "dkjfkdfj");

        expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    });
});

describe("error signup", () => {
    it("app tries to redirect after error signup", async () => {
        // @ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(SIGNUP_MOCK_ERROR),
            })
        );
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        );
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        const page = (await screen.findAllByRole("link", { name: "Sign Up" })).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;
        expect(page).toBeInTheDocument();
        fireEvent.click(page);

        expect(screen.getByTestId("location-display")).toHaveTextContent("/signup");

        const formEls = {
            username: screen.getByPlaceholderText(/my_username/g) as HTMLInputElement,
            email: screen.getByPlaceholderText(/example@email.com/g) as HTMLInputElement,
            password: screen.getByPlaceholderText(
                /\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g
            ) as HTMLInputElement,
            btn: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };

        //check the input elements are in the document
        expect(formEls.username).toBeInTheDocument();
        expect(formEls.email).toBeInTheDocument();
        expect(formEls.password).toBeInTheDocument();
        expect(formEls.btn).toBeInTheDocument();

        // type inputs to form fields and submit

        user.type(formEls.username, SIGNUP_MOCK_PAYLOAD.username);
        user.type(formEls.email, SIGNUP_MOCK_PAYLOAD.email);
        user.type(formEls.password, SIGNUP_MOCK_PAYLOAD.password);

        user.clear(formEls.username);
        user.clear(formEls.email);
        user.clear(formEls.password);
        expect(formEls.username.value).toBe("");
        expect(formEls.email.value).toBe("");
        expect(formEls.password.value).toBe("");

        user.type(formEls.username, SIGNUP_MOCK_PAYLOAD.username);
        user.type(formEls.email, SIGNUP_MOCK_PAYLOAD.email);
        user.type(formEls.password, SIGNUP_MOCK_PAYLOAD.password);
        expect(formEls.username.value).toBe(SIGNUP_MOCK_PAYLOAD.username);
        expect(formEls.email.value).toBe(SIGNUP_MOCK_PAYLOAD.email);
        expect(formEls.password.value).toBe(SIGNUP_MOCK_PAYLOAD.password);

        //click signup to simulate api mock

        await act(async () => {
            formEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(1);

        expect(screen.getByTestId("location-display")).toHaveTextContent("/signup");
    });
});
