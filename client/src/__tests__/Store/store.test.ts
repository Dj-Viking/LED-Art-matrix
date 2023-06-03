import { ledSlice, initialLLedState } from "../../store/ledSlice";
import {
    presetButtonsListSlice,
    initialPresetButtonListState,
} from "../../store/presetButtonListSlice";
import { PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { GlobalState } from "../../types";

let initialState = {
    ...initialLLedState,
    ...initialPresetButtonListState,
} as Partial<GlobalState>;

describe("Redux store and slices", () => {
    describe("ledSlice", () => {
        // cover initial state fns
        initialState?.resetTimerFn?.();

        beforeEach(() => {
            initialState = {
                resetTimerFn: () => void 0,
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
                ...initialState,
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
                midiMode: false,
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
});
