import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPresetButton, IPresetButtonsListState } from "../types";
import { produce } from "immer";
import {
    buildGetDefaultPresetAction,
    buildGetPresetButtonsAction,
} from "./actions/presetButtonsActionCreators";
import { newReducer } from "../utils/newReducer";

export const initialPresetButtonListState: IPresetButtonsListState = {
    midiMode: false,
    presetButtons: [],
};

const getDefaultPresetAsync = buildGetDefaultPresetAction;
const getPresetsAsync = buildGetPresetButtonsAction;

export const presetButtonsListSlice = createSlice({
    name: "presetButtonsListSlice",
    initialState: initialPresetButtonListState,
    reducers: {
        setPresetButtonsList: (
            state: IPresetButtonsListState,
            action: PayloadAction<IPresetButton[]>
        ) => {
            return produce(state, () => {
                state.presetButtons = action.payload;
            });
        },
        toggleMidiMode: (state: IPresetButtonsListState) => {
            return produce(state, () => {
                state.midiMode = !state.midiMode;
            });
        },
        setActiveButton: (state: IPresetButtonsListState, action: PayloadAction<string>) => {
            return produce(state, () => {
                let newList = [];

                const id = action.payload;
                console.log("calling this", id);

                newList = state.presetButtons.map((btn) => {
                    const _btn = btn;
                    if (_btn.id === id) {
                        _btn.isActive = true;
                        return _btn;
                    } else {
                        _btn.isActive = false;
                        return _btn;
                    }
                });

                state.presetButtons = newList;
            });
        },
        checkPresetButtonsActive: (
            state: IPresetButtonsListState,
            action: PayloadAction<{ id: string }>
        ) => {
            return produce(state, () => {
                let newList = [];

                const { id } = action.payload;

                newList = state.presetButtons.map((btn) => {
                    const _btn = btn;
                    switch (true) {
                        case _btn.id === id && _btn.isActive: {
                            _btn.isActive = true;
                            return _btn;
                        }
                        case _btn.isActive && _btn.id !== id: {
                            _btn.isActive = false;
                            return _btn;
                        }
                        case !_btn.isActive && _btn.id === id: {
                            _btn.isActive = true;
                            return _btn;
                        }
                        default:
                            return _btn;
                    }
                });

                state.presetButtons = newList;
            });
        },
        setAllInactive: (state: IPresetButtonsListState) => {
            return produce(state, () => {
                let newList = [];

                newList = state.presetButtons.map((btn) => {
                    const _btn = btn;
                    _btn.isActive = false;
                    return _btn;
                });

                state.presetButtons = newList;
            });
        },
        deletePreset: (state: IPresetButtonsListState, action: PayloadAction<{ id: string }>) => {
            return produce(state, () => {
                let newList = [];

                const { id } = action.payload;

                newList = state.presetButtons.filter((btn) => btn.id !== id);

                state.presetButtons = newList;
            });
        },
    },
    extraReducers: (builder) => {
        newReducer(builder, getPresetsAsync.fulfilled, (state, action) => {
            state.presetButtons = action.payload.presetButtons;
        });
    },
});

export const presetButtonsListActions = {
    ...presetButtonsListSlice.actions,
    getDefaultPresetAsync,
    getPresetsAsync,
};
