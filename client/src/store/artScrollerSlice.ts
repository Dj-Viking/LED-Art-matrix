import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IArtScrollerState, IGif } from "../types";
import { produce } from "immer";
import { buildCreateGifsAction, buildGetGifsAction } from "./actions/gifActionCreators";
import { newReducer } from "../utils/newReducer";

const initialState: IArtScrollerState = {
    figureOn: false,
    gifs: [],
    listNames: [],
    listNameIndex: 0,
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
        selectListName: (
            state: IArtScrollerState,
            action: PayloadAction<{ listName: string; listNameIndex: string }>
        ) => {
            return produce(state, () => {
                state.listName = action.payload.listName;
                state.listNameIndex = Number(action.payload.listNameIndex);
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
            state.listNames = action.payload.gifs.map((gif) => gif.listName);
            state.listNameIndex = state.listNames.indexOf(state.listName);
        });

        newReducer(builder, createGifCollectionAsync.fulfilled, (state, action) => {
            state.gifs = action.payload.gifs;
            state.listName = action.payload.newListName;
            state.listNames = [...state.listNames, action.payload.newListName];
        });
    },
});

export const artScrollerActions = {
    ...artScrollerSlice.actions,
    getGifsAsync,
    createGifCollectionAsync,
};
