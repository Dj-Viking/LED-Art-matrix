import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { CallbackMapping } from "../utils/MIDIMappingClass";
import { KeyChannel, KeyInputName, KeyMapping } from "../utils/KeyMappingClass";
import { UIInterfaceDeviceName } from "../constants";

export type KeyboardSliceState = {
    keyMappingEditOptions: {
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
    keyChannel: KeyChannel;
};
export const defaultMappingEditOptions = {
    uiName: "" as any,
};

export const initialKeyboardSliceState: KeyboardSliceState = {
    keyMapEditMode: false,
    isListeningForKeyMappingEdit: false,
    keyChannel: 69,
    keyMappingEditOptions: defaultMappingEditOptions,
    keyboardMappingInUse: {
        recentlyUsed: "keyboard",
        hasPreference: false,
        keyMappingPreference: {
            keyboard: {} as any,
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
            action: PayloadAction<Partial<KeyboardSliceState["keyMappingEditOptions"]>>
        ) => {
            return produce(state, () => {
                state.keyMappingEditOptions = {
                    ...state.keyMappingEditOptions,
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
