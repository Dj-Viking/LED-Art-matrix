/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../store";
import { createStore } from "redux";
import { Provider } from "react-redux";
import user from "@testing-library/user-event";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import {
    LOGIN_MOCK_PAYLOAD_USERNAME,
    LOGIN_MOCK_TOKEN,
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
} from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

// did not have this method implemented by default during the test
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { LOCATION_DISPLAY_ID } from "../../constants";
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

let mockFetch: jest.Mock<any, any>;

describe("test signup functionality with token", () => {
    document.body.innerHTML = "";

    //create a reference to the original fetch before we change it swap it back
    const originalFetch = global.fetch;
    beforeEach(() => {
        const fakeFetchRes = (
            value: any
        ): Promise<{
            status: 200;
            json: () => Promise<any>;
        }> => Promise.resolve({ status: 200, json: () => Promise.resolve(value) });
        mockFetch = jest
            .fn()
            //default
            // .mockReturnValue("kdfjkdj")
            // first
            .mockReturnValueOnce(fakeFetchRes(LOGIN_MOCK_TOKEN))
            // second
            .mockReturnValueOnce(fakeFetchRes({ presets: [] }))
            // third
            .mockReturnValueOnce(fakeFetchRes({ preset: "waves" }));
        // @ts-ignore
        global.fetch = mockFetch;
    });

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
        localStorage.clear(); //clear local storage since this test will set a token in LS and log a user in
    });

    it("Checks the input fields are available and can submit with a stubbed api", async () => {
        const history = createMemoryHistory();
        render(
            <>
                <Provider store={store}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Provider>
            </>
        );
        expect(screen.getByTestId("location-display").textContent).toBe("/");

        const page = (await screen.findAllByRole("link", { name: "Login" })).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;
        expect(page).toBeInTheDocument();
        act(() => {
            fireEvent.click(page);
        });

        expect(screen.getByTestId(LOCATION_DISPLAY_ID).textContent).toBe("/login");

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
        expect(inputEls.emailOrUsername.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.emailOrUsername);
        expect(inputEls.password.value).toBe(LOGIN_MOCK_PAYLOAD_USERNAME.password);
        // fireEvent.click(inputEls.btn);
        await act(async () => {
            inputEls.btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        const logout = (await screen.findAllByText(/Logout/g)).find((el) => {
            return el.classList.contains("nav-button");
        }) as HTMLElement;

        expect(logout).toBeInTheDocument();

        document.body.innerHTML = "";
    });
});
