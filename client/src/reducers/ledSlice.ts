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
            return produce(state, (draft) => {
                draft.html = "";
            });
        },
        setLedStyle: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.html = action.payload;
            });
        },
        setAnimVarCoeff: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.animVarCoeff = action.payload;
            });
        },
        setPresetName: (state: ILedState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.presetName = action.payload;
            });
        },
    },
});

export const ledActions = {
    ...ledSlice.actions,
};