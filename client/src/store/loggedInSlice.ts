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
            return produce(state, () => {
                state.loggedIn = true;
            });
        },
        logout: (state: ILoggedInState) => {
            return produce(state, () => {
                state.loggedIn = false;
            });
        },
    },
});

export const loggedInActions = {
    ...loggedInSlice.actions,
};
