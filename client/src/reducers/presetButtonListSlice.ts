import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPresetButton, IPresetButtonsListState } from "../types";
import { produce } from "immer";

const initialState: IPresetButtonsListState = {
    midiMode: false,
    presetButtons: [],
};

export const presetButtonsListSlice = createSlice({
    name: "presetButtonsListSlice",
    initialState,
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
        deletePreset: (
            state: IPresetButtonsListState,
            action: PayloadAction<{ buttons: IPresetButton[]; id: string }>
        ) => {
            return produce(state, (draft) => {
                let newList = [];

                const { buttons, id } = action.payload;

                newList = buttons.filter((btn) => btn.id !== id);

                draft.presetButtons = newList;
            });
        },
    },
});

export const presetButtonsListActions = {
    ...presetButtonsListSlice.actions,
};
