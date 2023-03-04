/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import allReducers from "../../reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { TestService } from "../../utils/TestServiceClass";
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

const store = createStore(allReducers);

describe("test deleting a preset from the user's preset button list", () => {
    it("enables a delete function to allow clicking a preset that deletes it, checks if user wants to delete the preset first", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        localStorage.setItem("id_token", TestService.signTestToken(MOCK_SIGN_TOKEN_ARGS));
        expect(typeof localStorage.getItem("id_token")).toBe("string");
        const history = createMemoryHistory();

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
                fakeFetchRes({ preset: { displayName: "waves", presetName: "waves" } })
            )
            .mockReturnValueOnce(
                fakeFetchRes({ preset: { displayName: "waves", presetName: "waves" } })
            )
            .mockReturnValueOnce(fakeFetchRes({ message: "deleted" }));
        // @ts-ignore
        global.fetch = mockFetch;
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
        expect(fetch).toHaveBeenCalledTimes(2); // /user/presets first /user second

        expect((await screen.findByTestId("buttons-parent")).children).toHaveLength(14);

        const deleteBtn = await screen.findByTestId("deletePreset");

        expect(deleteBtn.textContent).toBe("Delete A Preset");
        act(() => {
            deleteBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        });
        expect(deleteBtn.textContent).toBe("Don't Delete A Preset");

        expect(fetch).toHaveBeenCalledTimes(3);
        // expect(fetch).toHaveBeenNthCalledWith(1, "kdjfdkj");
        const bogus = await screen.findByTestId("bogus");

        expect(bogus.classList.length).toBe(1);
        expect(bogus.classList[0]).toBe("preset-delete-mode");

        act(() => {
            bogus.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        const deleteModal = screen.getByTestId("delete-modal");

        expect(deleteModal.parentElement!.style.display).toBe("flex");

        const cancel = screen.getByTestId("modal-cancel-button");
        const confirm = screen.getByTestId("modal-confirm-button");

        act(() => {
            cancel.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(deleteModal.parentElement!.style.display).toBe("none");

        //activate a preset to cover the case where it was active and delete a preset button was clicked
        // should have class preset-delete-mode
        act(() => {
            bogus.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(deleteBtn.textContent).toBe("Delete A Preset");
        act(() => {
            deleteBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        });
        expect(deleteBtn.textContent).toBe("Don't Delete A Preset");

        expect(bogus.classList.length).toBe(1);
        expect(bogus.classList[0]).toBe("preset-delete-mode");

        act(() => {
            bogus.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(deleteModal.parentElement!.style.display).toBe("flex");

        act(() => {
            confirm.dispatchEvent(TestService.createBubbledEvent("click"));
        });

        expect(fetch).toHaveBeenCalledTimes(4);
        expect(fetch).toHaveBeenNthCalledWith(4, "http://localhost:3001/user/delete-preset", {
            body: expect.any(String),
            headers: { "Content-Type": "application/json", authorization: expect.any(String) },
            method: "DELETE",
        });
    });
});
