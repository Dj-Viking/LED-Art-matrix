// @ts-ignore
import React from "react";
import ChangePassword from "../../pages/ChangePassword";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render, cleanup, screen } from "@testing-library/react";
import {
    CHANGE_PASS_INPUT_MATCH,
    CHANGE_PASS_MOCK_RES,
    MOCK_ACCESS_INPUTS,
    MOCK_ACCESS_OUTPUTS,
} from "../../utils/mocks";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { HiddenLocationDisplay } from "../../App";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { toolkitStore } from "../../store/store";

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

const mockHistoryReplace = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useHistory: () => ({
        replace: mockHistoryReplace,
    }),
}));

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), ms));

describe("test that the fake window location pathname works with the jest test", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
    });

    it("render the change password page and enter a new password, should redirect to home", async () => {
        // @ts-ignore trying to mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(CHANGE_PASS_MOCK_RES),
            })
        );

        const history = createMemoryHistory({
            initialEntries: ["/changePassword/HERESATOKEN"],
        });

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <ChangePassword />
                        <HiddenLocationDisplay />
                    </Router>
                </Provider>
            </>
        );
        await act(async () => {
            return void 0;
        });
        expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

        const formEls = {
            newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
            confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
            submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };

        expect(formEls.newPass).toBeInTheDocument();
        expect(formEls.confirmPass).toBeInTheDocument();
        expect(formEls.submit).toBeInTheDocument();

        user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
        user.type(formEls.confirmPass, CHANGE_PASS_INPUT_MATCH.confirmPass);
        expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
        expect(formEls.confirmPass.value).toBe(CHANGE_PASS_INPUT_MATCH.confirmPass);

        await act(async () => {
            formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(mockHistoryReplace).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(mockHistoryReplace).toHaveBeenCalledWith("/");
    });

    it("test if passwords don't match to throw error", async () => {
        // @ts-ignore trying to mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(CHANGE_PASS_MOCK_RES),
            })
        );
        const history = createMemoryHistory({
            initialEntries: ["/changePassword/HERESATOKEN"],
        });

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <ChangePassword />
                        <HiddenLocationDisplay />
                    </Router>
                </Provider>
            </>
        );
        await act(async () => {
            return void 0;
        });
        expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

        const formEls = {
            newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
            confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
            submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };

        expect(formEls.newPass).toBeInTheDocument();
        expect(formEls.confirmPass).toBeInTheDocument();
        expect(formEls.submit).toBeInTheDocument();

        user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
        user.type(formEls.confirmPass, "not matching");
        expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
        expect(formEls.confirmPass.value).toBe("not matching");

        await act(async () => {
            formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(mockHistoryReplace).toHaveBeenCalledTimes(0);
        expect(fetch).toHaveBeenCalledTimes(0);
        // expect(mockHistoryReplace).toHaveBeenCalledWith("/");
        expect(screen.getByTestId("error-message").textContent).toBe("Passwords do not match.");
    });

    it("test if api error appears", async () => {
        // @ts-ignore trying to mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                status: 400,
            })
        );
        const history = createMemoryHistory({
            initialEntries: ["/changePassword/HERESATOKEN"],
        });

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <ChangePassword />
                        <HiddenLocationDisplay />
                    </Router>
                </Provider>
            </>
        );
        await act(async () => {
            return void 0;
        });
        expect(screen.getByTestId("location-display")).toHaveTextContent("/changePassword/HERESATOKEN");

        const formEls = {
            newPass: screen.getByPlaceholderText(/New Password/g) as HTMLInputElement,
            confirmPass: screen.getByPlaceholderText(/Confirm Password/g) as HTMLInputElement,
            submit: screen.getAllByRole("button", { name: "Submit" }).find((btn) => {
                return btn.classList.contains("form-btn");
            }) as HTMLElement,
        };

        expect(formEls.newPass).toBeInTheDocument();
        expect(formEls.confirmPass).toBeInTheDocument();
        expect(formEls.submit).toBeInTheDocument();

        user.type(formEls.newPass, CHANGE_PASS_INPUT_MATCH.newPass);
        user.type(formEls.confirmPass, CHANGE_PASS_INPUT_MATCH.confirmPass);
        expect(formEls.newPass.value).toBe(CHANGE_PASS_INPUT_MATCH.newPass);
        expect(formEls.confirmPass.value).toBe(CHANGE_PASS_INPUT_MATCH.confirmPass);

        await act(async () => {
            formEls.submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(mockHistoryReplace).toHaveBeenCalledTimes(0);
        expect(fetch).toHaveBeenCalledTimes(1);

        // expect(mockHistoryReplace).toHaveBeenCalledWith("/");
    });
});
