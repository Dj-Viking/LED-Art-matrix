import { configureStore } from "@reduxjs/toolkit";
import { midiSlice } from "./midiSlice";
import { loggedInSlice } from "./loggedInSlice";
import { ledSlice } from "./ledSlice";
import { modalSlice } from "./modalSlice";
import { formSlice } from "./formSlice";
import { presetButtonsListSlice } from "./presetButtonListSlice";

export const toolkitStore = configureStore({
    reducer: {
        midiState: midiSlice.reducer,
        loggedInState: loggedInSlice.reducer,
        ledState: ledSlice.reducer,
        modalState: modalSlice.reducer,
        formState: formSlice.reducer,
        presetButtonsListState: presetButtonsListSlice.reducer,
    },
});

export type ToolkitRootState = ReturnType<typeof toolkitStore.getState>;

export type ToolkitDispatch = typeof toolkitStore.dispatch;
