import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILoginFormState, ISignupFormState } from "../types";
import { produce } from "immer";

export type CombinedFormState = ILoginFormState & ISignupFormState;

const initialState: CombinedFormState = {
    loginEmailIsComplete: false,
    loginPassword: "",
    loginPasswordIsComplete: false,
    loginUsernameOrEmail: "",
    signupEmail: "",
    signupEmailIsComplete: false,
    signupPassword: "",
    signupPasswordIsComplete: false,
    signupUsername: "",
    signupUsernameIsComplete: false,
};

export const formSlice = createSlice({
    name: "formSlice",
    initialState,
    reducers: {
        signupPasswordChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.signupPassword = action.payload;
            });
        },
        signupEmailChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.signupEmail = action.payload;
            });
        },
        signupUsernameChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.signupUsername = action.payload;
            });
        },
        loginEmailChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.loginUsernameOrEmail = action.payload;
            });
        },
        loginPasswordChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, () => {
                state.loginPassword = action.payload;
            });
        },
    },
});

export const formActions = {
    ...formSlice.actions,
};
