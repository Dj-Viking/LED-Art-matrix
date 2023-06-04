import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IArtScrollerState, IGif } from "../types";
import { produce } from "immer";
import { buildCreateGifsAction, buildGetGifsAction } from "./actions/gifActionCreators";
import { newReducer } from "../utils/newReducer";

const initialState: IArtScrollerState = {
    figureOn: false,
    gifs: [],
    listName: "",
    slider: {
        animDuration: "30",
        circleWidth: "30",
        hPos: "33",
        vertPos: "111",
        invert: "0",
    },
};

const getGifsAsync = buildGetGifsAction;

const createGifCollectionAsync = buildCreateGifsAction;

export const artScrollerSlice = createSlice({
    name: "artScrollerSlice",
    initialState,
    reducers: {
        setListName: (state: IArtScrollerState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.listName = action.payload;
            });
        },
        setGifs: (state: IArtScrollerState, action: PayloadAction<IGif[]>) => {
            return produce(state, () => {
                state.gifs = action.payload;
            });
        },
        setFigureOn: (state: IArtScrollerState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.figureOn = action.payload;
            });
        },
        setSlider: (
            state: IArtScrollerState,
            action: PayloadAction<{ control: keyof IArtScrollerState["slider"]; value: string }>
        ) => {
            return produce(state, () => {
                const { control, value } = action.payload;
                state.slider[control] = value;
            });
        },
    },
    extraReducers: (builder) => {
        newReducer(builder, getGifsAsync.fulfilled, (state, action) => {
            state.gifs = action.payload.gifs;
            state.listName = action.payload.newListName;
        });

        newReducer(builder, createGifCollectionAsync.fulfilled, (state, action) => {
            state.gifs = action.payload.gifs;
            state.listName = action.payload.newListName;
        });
    },
});

export const artScrollerActions = {
    ...artScrollerSlice.actions,
    getGifsAsync,
    createGifCollectionAsync,
};
