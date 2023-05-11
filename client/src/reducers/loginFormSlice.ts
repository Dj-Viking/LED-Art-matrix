import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILoginFormState } from "../types";
import { produce } from "immer";

const initialState: ILoginFormState = {
    emailIsComplete: false,
    password: "",
    passwordIsComplete: false,
    usernameOrEmail: "",
};

export const loginFormSlice = createSlice({
    name: "loginFormSlice",
    initialState,
    reducers: {
        loginEmailChange: (state: ILoginFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.usernameOrEmail = action.payload;
            });
        },
        loginPasswordChange: (state: ILoginFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.password = action.payload;
            });
        },
    },
});

export const loginFormActions = {
    ...loginFormSlice.actions,
};
