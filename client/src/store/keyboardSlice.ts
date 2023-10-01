import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { newReducer } from "../utils/newReducer";
import { deepCopy } from "../utils/deepCopy";
import { CallbackMapping } from "../utils/MIDIMappingClass";
import { KeyChannel, KeyInputName, KeyMapping } from "../utils/KeyMappingClass";
import React from "react";

export type KeyboardSliceState = {
    keyboardMappingInUse: {
        recentlyUsed: KeyInputName;
        callbackMap: CallbackMapping;
        hasPreference: boolean;
        keyMappingPreference: Record<KeyInputName, KeyMapping<KeyInputName>>;
    };
    isListeningForMappingEdit: boolean;
    keyMapEditMode: boolean;
    channel: KeyChannel;
};
export const defaultMappingEditOptions = {
    uiName: "" as any,
};

export const initialKeyboardSliceState: KeyboardSliceState = {
    keyMapEditMode: false,
    isListeningForMappingEdit: false,
    channel: 69,
    keyboardMappingInUse: {
        recentlyUsed: "keyboard",
        hasPreference: false,
        keyMappingPreference: {
            j: {} as any,
            keyboard: {} as any,
            _: {} as any,
        },
        callbackMap: {} as any,
    },
};

export const keyboardSlice = createSlice({
    name: "keyboardSlice",
    initialState: initialKeyboardSliceState,
    reducers: {
        setCallbackMap: (state: KeyboardSliceState, action: PayloadAction<CallbackMapping>) => {
            return produce(state, () => {
                state.keyboardMappingInUse.callbackMap = action.payload;
            });
        },
        toggleKeyEditMode: (state: KeyboardSliceState) => {
            return produce(state, () => {
                // if we're currently toggling edit mode off then stop listening for midi preference editing changes
                console.log("setting listen foir key map in keyboard actiaon");
                if (state.keyMapEditMode) {
                    console.log("setting listen foir key map in keyboard actiaon");
                    state.isListeningForMappingEdit = false;
                } else {
                    state.isListeningForMappingEdit = true;
                }
                state.keyMapEditMode = !state.keyMapEditMode;
            });
        },
        updateKeyMapping: (
            state: KeyboardSliceState,
            action: PayloadAction<
                Tuple<React.MouseEvent<HTMLButtonElement>, React.MouseEvent<HTMLButtonElement>["type"]>
            >
        ) => {
            return produce(state, () => {
                if (action.payload[1] === "keyDown") {
                    //
                }
            });
        },
    },
    extraReducers: (builder) => {
        //
    },
});

export const keyboardActions = {
    ...keyboardSlice.actions,
};
