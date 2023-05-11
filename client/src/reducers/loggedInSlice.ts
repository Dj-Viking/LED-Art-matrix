import { createSlice } from "@reduxjs/toolkit";
import { ILoggedInState } from "../types";
import { produce } from "immer";

const initialState: ILoggedInState = {
    loggedIn: false,
};

export const loggedInSlice = createSlice({
    name: "loggedInSlice",
    initialState,
    reducers: {
        login: (state: ILoggedInState) => {
            produce(state, (draft) => {
                draft.loggedIn = true;
            });
        },
        logout: (state: ILoggedInState) => {
            produce(state, (draft) => {
                draft.loggedIn = false;
            });
        },
    },
});

export const loggedInActions = {
    ...loggedInSlice.actions,
};
