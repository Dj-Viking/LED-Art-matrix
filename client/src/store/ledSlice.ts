import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILedState } from "../types";
import { produce } from "immer";

export const initialLedState: ILedState = {
    animVarCoeff: "1",
    resetTimerFn: () => void 0,
    presetName: "",
    isHSL: true,
};

export const ledSlice = createSlice({
    name: "ledSlice",
    initialState: initialLedState,
    reducers: {
        setResetTimerFn: (state: ILedState, action: PayloadAction<() => void>) => {
            return produce(state, () => {
                state.resetTimerFn = action.payload;
            });
        },
        toggleIsHSL: (state: ILedState) => {
            return produce(state, () => {
                state.isHSL = !state.isHSL;
            });
        },
        setAnimVarCoeff: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.animVarCoeff = action.payload;
            });
        },
        setPresetName: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.presetName = action.payload;
            });
        },
    },
});

export const ledActions = {
    ...ledSlice.actions,
};
