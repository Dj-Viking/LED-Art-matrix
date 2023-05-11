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

export const toolkitStore = configureStore({
    reducer: {
        midiState: midiSlice.reducer,
        loggedInState: loggedInSlice.reducer,
        ledState: ledSlice.reducer,
        modalState: modalSlice.reducer,
        formState: formSlice.reducer,
        artScrollerState: artScrollerSlice.reducer,
        presetButtonsListState: presetButtonsListSlice.reducer,
    },
});

export function getGlobalState(selectorFn: typeof useSelector): GlobalState {
    const state = selectorFn((state: MyRootState) => state);

    let ret = {} as GlobalState;

    for (const stateKey of Object.keys(state)) {
        for (const stateValueKey of Object.keys(state[stateKey])) {
            ret[stateValueKey] = state[stateKey][stateValueKey];
        }
    }

    return ret;
}

export type ToolkitRootState = ReturnType<typeof toolkitStore.getState>;

export type ToolkitDispatch = typeof toolkitStore.dispatch;
