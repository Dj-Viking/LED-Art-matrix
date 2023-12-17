/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import { Provider } from "react-redux";
import { act } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { LOGIN_MOCK_TOKEN, MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS, MOCK_PRESETS } from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { mount, ReactWrapper } from "enzyme";
import { IPresetButtonsProps, PresetButtons } from "../../components/PresetButtons";
import {
    OpenNewWindowButton,
    SaveDefaultButton,
    DeleteButton,
    ToggleMIDIMapEditModeButton,
    IsHSLButton,
} from "../../components/PresetButton.style";
import { IDBPreset, PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { presetButtonsListActions } from "../../store/presetButtonListSlice";
import { toolkitStore } from "../../store/store";
import { Slider } from "../../components/Slider";
import { SavePresetModal } from "../../components/Modal/SavePresetModal";
import { DeletePresetModal } from "../../components/Modal/DeletePresetConfirmModal";
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

describe("test logging in and checking buttons are there", () => {
    //create a reference to the original fetch before we change it swap it back
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        localStorage.clear();
    });

    it("covers clicking the open new window button and calls the handler that opens the new window in the browser", () => {
        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={toolkitStore}>
                <PresetButtons />
            </Provider>
        );

        const openNewWindowButton = wrapper.find(OpenNewWindowButton);

        openNewWindowButton.props().handleOpenNewWindow?.({ preventDefault: () => null });
    });

    it("covers clicking the save default button click handler", () => {
        const wrapper: ReactWrapper<IPresetButtonsProps> = mount(
            <Provider store={toolkitStore}>
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
        toolkitStore.dispatch(
            presetButtonsListActions.setPresetButtonsList(
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
            <Provider store={toolkitStore}>
                <PresetButtons />
            </Provider>
        );

        const saveDefaultButton = wrapper.find(SaveDefaultButton);
        const savePresetModal = wrapper.find(SavePresetModal);
        const deletePresetModal = wrapper.find(DeletePresetModal);
        const deleteButton = wrapper.find(DeleteButton);
        const midiMapEditModebutton = wrapper.find(ToggleMIDIMapEditModeButton);
        const isHSLButton = wrapper.find(IsHSLButton);

        saveDefaultButton.props().clickHandler?.({ preventDefault: () => null });

        // cover save preset modal
        savePresetModal.props().onClose?.({ preventDefault: () => null } as any);
        // cover delete preset modal
        deletePresetModal.props().onCancel?.({ preventDefault: () => null } as any);
        deletePresetModal.props().onConfirm?.({ preventDefault: () => null } as any);

        // click delete button to activate delete mode
        deleteButton.props().clickHandler({ preventDefault: () => null } as any);

        // cover midi map edit mode button
        midiMapEditModebutton.props().toggleMIDIMapEditMode?.({ preventDefault: () => null } as any);

        act(() => {
            isHSLButton.simulate("click");
        });
    });
});
