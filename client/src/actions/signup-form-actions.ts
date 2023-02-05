import {
    ISignupEmailChangeAction,
    ISignupPasswordChangeAction,
    ISignupUsernameChangeAction,
} from "../types";

export const signupUsernameChange = (data: string): ISignupUsernameChangeAction => ({
    type: "SIGNUP_USERNAME_CHANGE",
    payload: data,
});
export const signupEmailChange = (data: string): ISignupEmailChangeAction => ({
    type: "SIGNUP_EMAIL_CHANGE",
    payload: data,
});
export const signupPasswordChange = (data: string): ISignupPasswordChangeAction => ({
    type: "SIGNUP_PASSWORD_CHANGE",
    payload: data,
});
