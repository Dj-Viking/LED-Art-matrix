import { ILoginUsernameOrEmailChangeAction, ILoginPasswordChangeAction } from "../types";

export const loginEmailChange = (usernameOrEmail: string): ILoginUsernameOrEmailChangeAction => ({
  type: "LOGIN_EMAIL_OR_USERNAME_CHANGE",
  payload: usernameOrEmail
});
export const loginPasswordChange = (data: string): ILoginPasswordChangeAction => ({
  type: "LOGIN_PASSWORD_CHANGE",
  payload: data
});
