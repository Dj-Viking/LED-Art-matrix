import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILedState } from "../types";
import { produce } from "immer";

const initialState: ILedState = {
    alpha: "",
    animVarCoeff: "",
    animationDurationState: "",
    isInverted: false,
    presetName: "",
    html: "",
};

export const ledSlice = createSlice({
    name: "ledSlice",
    initialState,
    reducers: {
        clearStyle: (state: ILedState) => {
            return produce(state, () => {
                state.html = "";
            });
        },
        setLedStyle: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.html = action.payload;
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