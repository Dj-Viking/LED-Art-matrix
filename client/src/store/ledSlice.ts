import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILedState } from "../types";
import { produce } from "immer";

const initialState: ILedState = {
    animVarCoeff: "1",
    animationDurationState: "",
    presetName: "",
    isHSL: true,
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
        toggleIsHSL: (state: ILedState) => {
            return produce(state, () => {
                state.isHSL = !state.isHSL;
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
