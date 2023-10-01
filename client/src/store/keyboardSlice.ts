import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { CallbackMapping } from "../utils/MIDIMappingClass";
import { KeyChannel, KeyInputName, KeyMapping } from "../utils/KeyMappingClass";
import React from "react";
import { UIInterfaceDeviceName } from "../constants";

export type KeyboardSliceState = {
    mappingEditOptions: {
        uiName: UIInterfaceDeviceName;
    };
    keyboardMappingInUse: {
        recentlyUsed: KeyInputName;
        callbackMap: CallbackMapping;
        hasPreference: boolean;
        keyMappingPreference: Record<KeyInputName, KeyMapping<KeyInputName>>;
    };
    isListeningForKeyMappingEdit: boolean;
    keyMapEditMode: boolean;
    channel: KeyChannel;
};
export const defaultMappingEditOptions = {
    uiName: "" as any,
};

export const initialKeyboardSliceState: KeyboardSliceState = {
    keyMapEditMode: false,
    isListeningForKeyMappingEdit: false,
    channel: 69,
    mappingEditOptions: defaultMappingEditOptions,
    keyboardMappingInUse: {
        recentlyUsed: "keyboard",
        hasPreference: false,
        keyMappingPreference: {
            j: {} as any,
            space: {} as any,
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
        setMappingEditOptions: (
            state: KeyboardSliceState,
            action: PayloadAction<Partial<KeyboardSliceState["mappingEditOptions"]>>
        ) => {
            return produce(state, () => {
                state.mappingEditOptions = {
                    ...state.mappingEditOptions,
                    ...action.payload,
                };
            });
        },
        toggleKeyEditMode: (state: KeyboardSliceState) => {
            return produce(state, () => {
                // if we're currently toggling edit mode off then stop listening for midi preference editing changes
                if (state.keyMapEditMode) {
                    state.isListeningForKeyMappingEdit = false;
                }
                state.keyMapEditMode = !state.keyMapEditMode;
            });
        },
        setIsListeningForEdits: (state: KeyboardSliceState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.isListeningForKeyMappingEdit = action.payload;
            });
        },
        updateKeyMapping: (state: KeyboardSliceState, action: PayloadAction<KeyInputName>) => {
            return produce(state, () => {
                if (action.payload) {
                    console.warn("TODO", "keyboard mapping not implemented yet");
                    console.log("key was passed to map!!!", action.payload);
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
