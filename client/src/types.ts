import jwt from "jsonwebtoken";

export type MyJwtData = IJwtData;
export interface IJwtData extends jwt.JwtPayload {
  _id: string;
  username: string;
  email: string;
  uuid?: string;
  adminUuid: string;
  role: "user" | "admin";
  resetEmail?: string;
  iat?: number;
  exp?: number;
}
export interface ILedState {
  alpha: string;
  presetName: string;
  animationDurationState: string;
  animationDelayState: string;
  isInverted: boolean;
}
export type ILedActionTypes = 
| "LOAD_USER_SPLASH_CONFIG"
| "INVERT_SWITCH"
| "PRESET_SWITCH"
| "ANIMATION_DELAY_CHANGE"
| "ANIMATION_DURATION_CHANGE"
| "ALPHA_FADER_CHANGE"

export type ILedActionPayloads = 
| ILedLoadUserSplashConfigAction["payload"]
| ILedAlphaFaderChangeAction["payload"]
| ILedAnimationDelayChange["payload"]
| ILedAnimationDurationChangeAction["payload"]
| ILedPresetSwitchAction["payload"]

export interface ILedAction {
  type: ILedActionTypes;
  payload: ILedActionPayloads;
}

export interface ILedLoadUserSplashConfigAction {
  type: "LOAD_USER_SPLASH_CONFIG";
  payload: {
    presetName: string;
    animationDelayState: string;
    animationDurationState: string;
  }
}

export interface ILedInvertSwitchAction {
  type: "INVERT_SWITCH";
  payload: string;
}
export interface ILedPresetSwitchAction {
  type: "PRESET_SWITCH";
  payload: string;
}
export interface ILedAnimationDurationChangeAction {
  type: "ANIMATION_DURATION_CHANGE";
  payload: string;
}
export interface ILedAnimationDelayChange {
  type: "ANIMATION_DELAY_CHANGE";
  payload: string;
}
export interface ILedAlphaFaderChangeAction {
  type: "ALPHA_FADER_CHANGE";
  payload: string;
}
export interface ILedSavePresetNameAction {
  type: "SAVE_PRESET_NAME";
  payload: string;
}
export interface ILedIsAnimatingAction {
  type: "IS_ANIMATING";
  payload: boolean;
}
// will get the type eventually
// eslint-disable-next-line 
export type IGif = any;
export interface IGetGifsAction {
  type: "GET_GIFS";
  payload: Array<IGif>;
}

export interface ILoginFormState {
  usernameOrEmail: string;
  emailIsComplete: boolean;
  password: string;
  passwordIsComplete: boolean;
}
export type ILoginFormActionTypes = 
| "LOGIN_EMAIL_OR_USERNAME_CHANGE"
| "LOGIN_EMAIL_COMPLETED"
| "LOGIN_PASSWORD_CHANGE"
| "LOGIN_PASSWORD_COMPLETED";

export type ILoginFormActionPayloads =
| ILoginUsernameOrEmailChangeAction["payload"]
| ILoginEmailCompletedAction["payload"]
| ILoginPasswordChangeAction["payload"]
| ILoginPasswordCompletedAction["payload"];

export interface ILoginFormAction {
  type: ILoginFormActionTypes;
  payload: ILoginFormActionPayloads;
}
export interface ILoginUsernameOrEmailChangeAction {
  type: "LOGIN_EMAIL_OR_USERNAME_CHANGE";
  payload: string;
}
export interface ILoginEmailCompletedAction {
  type: "LOGIN_EMAIL_COMPLETED";
  payload: boolean;
}
export interface ILoginPasswordChangeAction {
  type: "LOGIN_PASSWORD_CHANGE";
  payload: string;
}
export interface ILoginPasswordCompletedAction {
  type: "LOGIN_PASSWORD_COMPLETED";
  payload: boolean;
}
export interface ISignupFormState {
  username: string;
  usernameIsComplete: boolean;
  email: string;
  emailIsComplete: boolean;
  password: string;
  passwordIsComplete: boolean;
}
export type ISignupFormActionTypes = 
| "SIGNUP_USERNAME_CHANGE"
| "SIGNUP_USERNAME_COMPLETED"
| "SIGNUP_EMAIL_CHANGE"
| "SIGNUP_EMAIL_COMPLETED"
| "SIGNUP_PASSWORD_CHANGE"
| "SIGNUP_PASSWORD_COMPLETED";

export type ISignupFormActionPayloads =
| ISignupEmailChangeAction["payload"]
| ISignupEmailCompletedAction["payload"]
| ISignupUsernameChangeAction["payload"]
| ISignupUsernameCompletedAction["payload"]
| ISignupPasswordChangeAction["payload"]
| ISignupPasswordCompletedAction["payload"];

export interface ISignupFormAction {
  type: ISignupFormActionTypes
  payload: ISignupFormActionPayloads
}

export interface ISignupUsernameChangeAction {
  type: "SIGNUP_USERNAME_CHANGE";
  payload: string;
}
export interface ISignupUsernameCompletedAction {
  type: "SIGNUP_USERNAME_COMPLETED";
  payload: boolean;
}
export interface ISignupEmailChangeAction {
  type: "SIGNUP_EMAIL_CHANGE";
  payload: string;
}
export interface ISignupEmailCompletedAction {
  type: "SIGNUP_EMAIL_COMPLETED";
  payload: boolean;
}
export interface ISignupPasswordChangeAction {
  type: "SIGNUP_PASSWORD_CHANGE";
  payload: string;
}
export interface ISignupPasswordCompletedAction {
  type: "SIGNUP_PASSWORD_COMPLETED";
  payload: boolean;
}

export interface IArtScrollerState {
  gifs: Array<IGif>;
}

export type IArtScrollerActionTypes = 
| IGetGifsAction["type"]

export type IArtScrollerPayloads = 
| IGetGifsAction["payload"]

export interface IArtScrollerAction {
  type: IArtScrollerActionTypes;
  payload: IArtScrollerPayloads
}

export interface MyRootState {
  ledState: ILedState;
  loginFormState: ILoginFormState;
  signupFormState: ISignupFormState;
  artScrollerState: IArtScrollerState;
}
