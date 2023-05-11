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
            return produce(state, (draft) => {
                draft.signupPassword = action.payload;
            });
        },
        signupEmailChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.signupEmail = action.payload;
            });
        },
        signupUsernameChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.signupUsername = action.payload;
            });
        },
        loginEmailChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.loginUsernameOrEmail = action.payload;
            });
        },
        loginPasswordChange: (state: CombinedFormState, action: PayloadAction<string>) => {
            return produce(state, (draft) => {
                draft.loginPassword = action.payload;
            });
        },
    },
});

export const formActions = {
    ...formSlice.actions,
};
