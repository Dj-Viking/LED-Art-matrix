import { ledSlice, initialLLedState } from "../../store/ledSlice";
import {
    presetButtonsListSlice,
    initialPresetButtonListState,
} from "../../store/presetButtonListSlice";
import { PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { GlobalState } from "../../types";
import { initialMidiSliceState, midiSlice } from "../../store/midiSlice";
import { SUPPORTED_CONTROLLERS } from "../../constants";

let initialState = {
    ...initialLLedState,
    ...initialPresetButtonListState,
    ...initialMidiSliceState,
} as Partial<GlobalState>;

const resetInitialState = (): Partial<GlobalState> => {
    return {
        ...initialLLedState,
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
                midiMappingInUse: SUPPORTED_CONTROLLERS["Not Found"],
                midiMappings: SUPPORTED_CONTROLLERS,
            };
        });

        // IDGAF bout this right now
        it.skip("test setting the controller in use", () => {
            expect(initialState.controllerInUse).toBe("Not Found");

            const action = midiSlice.actions.setControllerInUse("TouchOSC Bridge");

            const newState = midiSlice.reducer(initialState as any, action);

            expect(newState.controllerInUse).not.toBe("Not Found");

            expect(newState.controllerInUse).toBe("TouchOSC Bridge");

            expect(newState.midiMappingInUse).toBe(SUPPORTED_CONTROLLERS["TouchOSC Bridge"]);
        });
    });
});
