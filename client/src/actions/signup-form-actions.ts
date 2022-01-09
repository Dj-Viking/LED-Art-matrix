import { ISignupEmailChangeAction, ISignupEmailCompletedAction, ISignupPasswordChangeAction, ISignupPasswordCompletedAction, ISignupUsernameChangeAction, ISignupUsernameCompletedAction } from "../types";

export const signupUsernameChange = (data: string): ISignupUsernameChangeAction => ({
  type: "SIGNUP_USERNAME_CHANGE",
  payload: data
});
export const signupUsernameCompleted = (data: string): ISignupUsernameCompletedAction => {
  if (data.length > 0) {
    return {
      type: "SIGNUP_USERNAME_COMPLETED",
      payload: true
    };
  } 
  return {
    type: "SIGNUP_USERNAME_COMPLETED",
    payload: false
  };
};
export const signupEmailChange = (data: string): ISignupEmailChangeAction => ({
  type: "SIGNUP_EMAIL_CHANGE",
  payload: data
});
export const signupEmailCompleted = (data: string): ISignupEmailCompletedAction => {
  if (data.length > 0) {
    return {
      type: "SIGNUP_EMAIL_COMPLETED",
      payload: true
    };
  } 
  return {
    type: "SIGNUP_EMAIL_COMPLETED",
    payload: false
  };
};
export const signupPasswordChange = (data: string): ISignupPasswordChangeAction => ({
  type: "SIGNUP_PASSWORD_CHANGE",
  payload: data
});
export const signupPasswordCompleted = (data: string): ISignupPasswordCompletedAction => {
  if (data.length > 0) {
    return {
      type: "SIGNUP_PASSWORD_COMPLETED",
      payload: true
    };
  } 
  return {
    type: "SIGNUP_PASSWORD_COMPLETED",
    payload: false
  };
};
