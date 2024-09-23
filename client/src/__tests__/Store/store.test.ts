/* eslint-disable @typescript-eslint/no-explicit-any */
import { ledSlice, initialLedState } from "../../store/ledSlice";
import { presetButtonsListSlice, initialPresetButtonListState } from "../../store/presetButtonListSlice";
import { PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { GlobalState } from "../../types";
import { initialMidiSliceState, midiSlice } from "../../store/midiSlice";
import { mockBlankStorageMIDIMapping, resetlocalstorage, setuplocalstorage } from "./storetestdata";
import { DEFAULT_NOT_FOUND_MAPPING_PREFERENCE_TABLE } from "../../constants";

let initialState = {
    ...initialLedState,
    ...initialPresetButtonListState,
    ...initialMidiSliceState,
} as Partial<GlobalState>;

const resetInitialState = (): Partial<GlobalState> => {
    return {
        ...initialLedState,
        ...initialPresetButtonListState,
        ...initialMidiSliceState,
    };
};

describe("Redux store and slices", () => {
    describe("ledSlice", () => {
        // cover initial state fns
        initialState?.resetTimerFn?.();

        beforeEach(() => {
            initialState = {
                ...resetInitialState(),
            };
        });

        it("resetTimeFn", () => {
            const action = ledSlice.actions.setResetTimerFn(() => null);

            const newState = ledSlice.reducer(initialState as any, action);

            expect(newState.resetTimerFn.toString()).toBe((() => null).toString());
        });
    });
    describe("presetButtonListSlice", () => {
        beforeEach(() => {
            initialState = {
                ...resetInitialState(),
                presetButtons: new PresetButtonsList(
                    () => null,
                    [
                        {
                            _id: "some id",
                            animVarCoeff: "1",
                            displayName: "vikings rule",
                            presetName: "420 blaze it!",
                        },
                        {
                            _id: "some other id",
                            animVarCoeff: "2",
                            displayName: "vikings rule more",
                            presetName: "huh huh 69",
                        },
                    ],
                    "some other id"
                ).getList(),
            };
        });

        it("setActiveButton", () => {
            const action = presetButtonsListSlice.actions.setActiveButton("some id");

            const newState = presetButtonsListSlice.reducer(initialState as any, action);

            const activePreset = newState.presetButtons.find((btn) => btn.isActive);

            expect(activePreset?.id).not.toBe("some other id");

            expect(activePreset?.id).toBe("some id");
        });
    });
    describe("midiSlice", () => {
        beforeEach(() => {
            initialState = {
                ...resetInitialState(),
                controllerInUse: "Not Found",
                midiMappingInUse: {
                    "callbackMap": {} as any, // not used??? deprecate it
                    "hasPreference": false, // using in the code now? if not - fuckin remove it!
                    "midiMappingPreference": {
                        "Not Found": DEFAULT_NOT_FOUND_MAPPING_PREFERENCE_TABLE as any
                    } as any,
                    "recentlyUsed": "Not Found"
                }
            };

            setuplocalstorage();
        });

        afterEach(() => {
            resetlocalstorage();
        });

        it("test setting the controller in use", () => {
            
            // expect(localStorage.getItem(localStorage.key(0) as string))

            expect(initialState.controllerInUse).toBe("Not Found");

            expect(initialState.midiMappingInUse?.midiMappingPreference["Not Found"])
            .toStrictEqual(mockBlankStorageMIDIMapping["Not Found"]);

            const action = midiSlice.actions.setControllerInUse({
                "controllerName": "TouchOSC Bridge",
                "hasPreference": false
            });

            const newState = midiSlice.reducer(initialState as any, action);

            expect(newState.controllerInUse).not.toBe("Not Found");

            expect(newState.controllerInUse).toBe("TouchOSC Bridge");

            // local storage has blank preference mappings for now

            expect(newState.midiMappingInUse.midiMappingPreference["TouchOSC Bridge"])
            .toStrictEqual(mockBlankStorageMIDIMapping["TouchOSC Bridge"]);

        });
    });
});
