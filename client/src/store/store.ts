import { configureStore } from "@reduxjs/toolkit";
import { midiSlice } from "./midiSlice";
import { loggedInSlice } from "./loggedInSlice";
import { ledSlice } from "./ledSlice";
import { modalSlice } from "./modalSlice";
import { formSlice } from "./formSlice";
import { artScrollerSlice } from "./artScrollerSlice";
import { presetButtonsListSlice } from "./presetButtonListSlice";
import { GlobalState, MyRootState } from "../types";
import { useSelector } from "react-redux";
import { keyboardSlice } from "./keyboardSlice";

export const toolkitReducer = {
    midiState: midiSlice.reducer,
    loggedInState: loggedInSlice.reducer,
    keyboardState: keyboardSlice.reducer,
    ledState: ledSlice.reducer,
    modalState: modalSlice.reducer,
    formState: formSlice.reducer,
    artScrollerState: artScrollerSlice.reducer,
    presetButtonsListState: presetButtonsListSlice.reducer,
};

export const toolkitStore = configureStore({
    // silence the non-serializable errors because I just don't care about it.
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
    reducer: toolkitReducer,
});

export function getGlobalState(selectorFn: typeof useSelector): GlobalState {
    const rootState = selectorFn((state: MyRootState) => state);

    let ret = {} as GlobalState;

    for (const sliceName of Object.keys(rootState)) {
        for (const sliceProp of Object.keys(rootState[sliceName])) {
            ret[sliceProp] = rootState[sliceName][sliceProp];
        }
    }

    return ret;
}

export type ToolkitRootState = ReturnType<typeof toolkitStore.getState>;

export type ToolkitDispatch = typeof toolkitStore.dispatch;
