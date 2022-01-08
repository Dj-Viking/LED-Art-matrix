import { ILoginUsernameOrEmailChangeAction, ILoginEmailCompletedAction, ILoginPasswordChangeAction, ILoginPasswordCompletedAction } from "../types";

export const loginEmailChange = (usernameOrEmail: string): ILoginUsernameOrEmailChangeAction => ({
  type: "LOGIN_EMAIL_OR_USERNAME_CHANGE",
  payload: usernameOrEmail
});
export const loginEmailCompleted = (data: string): ILoginEmailCompletedAction => {
  if (data.length > 0) {
    return {
      type: "LOGIN_EMAIL_COMPLETED",
      payload: true
    };
  } 
  return {
    type: "LOGIN_EMAIL_COMPLETED",
    payload: false
  };
};
export const loginPasswordChange = (data: string): ILoginPasswordChangeAction => ({
  type: "LOGIN_PASSWORD_CHANGE",
  payload: data
});
export const loginPasswordCompleted = (data: string): ILoginPasswordCompletedAction => {
  if (data.length > 0) {
    return {
      type: "LOGIN_PASSWORD_COMPLETED",
      payload: true
    };
  } 
  return {
    type: "LOGIN_PASSWORD_COMPLETED",
    payload: false
  };
};
