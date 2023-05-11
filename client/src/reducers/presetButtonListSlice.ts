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
        toggleMidiMode: (state: IPresetButtonsListState) => {
            return produce(state, (draft) => {
                draft.midiMode = !state.midiMode;
            });
        },
        setActiveButton: (state: IPresetButtonsListState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                let newList = [];

                const id = action.payload;

                newList = state.presetButtons.map((btn) => {
                    if (btn.id === id) {
                        btn.isActive = true;
                        return btn;
                    } else {
                        btn.isActive = false;
                        return btn;
                    }
                });

                draft.presetButtons = newList;
            });
        },
        checkPresetButtonsActive: (
            state: IPresetButtonsListState,
            action: PayloadAction<{ buttons: IPresetButton[]; id: string }>
        ) => {
            return produce(state, (draft) => {
                let newList = [];

                const { buttons, id } = action.payload;

                newList = buttons.map((btn) => {
                    switch (true) {
                        case btn.id === id && btn.isActive: {
                            btn.isActive = true;
                            return btn;
                        }
                        case btn.isActive && btn.id !== id: {
                            btn.isActive = false;
                            return btn;
                        }
                        case !btn.isActive && btn.id === id: {
                            btn.isActive = true;
                            return btn;
                        }
                        default:
                            return btn;
                    }
                });

                draft.presetButtons = newList;
            });
        },
        setAllInactive: (
            state: IPresetButtonsListState,
            action: PayloadAction<IPresetButton[]>
        ) => {
            return produce(state, (draft) => {
                let newList = [];

                newList = action.payload.map((btn) => {
                    btn.isActive = false;
                    return btn;
                });

                draft.presetButtons = newList;
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
