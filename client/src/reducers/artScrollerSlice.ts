import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IArtScrollerState, IGif } from "../types";
import { produce } from "immer";

const initialState: IArtScrollerState = {
    figureOn: false,
    gifs: [],
    listName: "",
    slider: {
        animDuration: "",
        circleWidth: "",
        hPos: "",
        vertPos: "",
        invert: "",
    },
};

export const artScrollerSlice = createSlice({
    name: "artScrollerSlice",
    initialState,
    reducers: {
        setListName: (state: IArtScrollerState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.listName = action.payload;
            });
        },
        setGifs: (state: IArtScrollerState, action: PayloadAction<IGif[]>) => {
            return produce(state, (draft) => {
                draft.gifs = action.payload;
            });
        },
        setFigureOn: (state: IArtScrollerState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                draft.figureOn = action.payload;
            });
        },
        setSlider: (
            state: IArtScrollerState,
            action: PayloadAction<{ control: keyof IArtScrollerState["slider"]; value: string }>
        ) => {
            return produce(state, (draft) => {
                const { control, value } = action.payload;
                draft.slider[control] = value;
            });
        },
    },
});

export const artScrollerActions = {
    ...artScrollerSlice.actions,
};
