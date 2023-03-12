// eslint-disable-next-line
// @ts-ignore
import React from "react";
import App from "../../App";
import { combinedReducers } from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, cleanup, screen, fireEvent, act } from "@testing-library/react";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS, SIGNUP_MOCK_RESULT } from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
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

const originalFetch = global.fetch;

afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
    localStorage.clear();
});

it("Render the home page and then click sign up button to go to that page", async () => {
    // @ts-ignore trying to mock fetch
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(SIGNUP_MOCK_RESULT),
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

    const link = await screen.findByText(/^Sign\sUp$/g);
    expect(link).toBeInTheDocument();
    fireEvent.click(link);

    const formEls = {
        username: screen.getByPlaceholderText(/my_username/g),
        email: screen.getByPlaceholderText(/example@email.com/g),
        password: screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/g),
        signup: screen.getAllByRole("button", { name: "Sign Up" }).find((btn) => {
            return btn.classList.contains("form-btn");
        }) as HTMLElement,
    };

    expect(formEls.username).toBeInTheDocument();
    expect(formEls.email).toBeInTheDocument();
    expect(formEls.password).toBeInTheDocument();
    expect(formEls.signup).toBeInTheDocument();
});
