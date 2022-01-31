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
  isInverted: boolean;
  animVarCoeff: string;
}
export type ILedActionTypes = 
| "LOAD_USER_SPLASH_CONFIG"
| "INVERT_SWITCH"
| "PRESET_SWITCH"
| "VAR_COEFF_CHANGE"
| "ALPHA_FADER_CHANGE";

export type ILedActionPayloads = 
| ILedLoadUserSplashConfigAction["payload"]
| ILedAlphaFaderChangeAction["payload"]
| ILedAnimationDelayChange["payload"]
| ILedAnimVarCoeffChangeAction["payload"]
| ILedAnimationDurationChangeAction["payload"]
| ILedPresetSwitchAction["payload"]

export interface ILedAction {
  type: ILedActionTypes;
  payload: ILedActionPayloads;
}

export interface ILedAnimVarCoeffChangeAction {
  type: "VAR_COEFF_CHANGE";
  payload: string;
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
export interface IGif {
  gifCategory: string;
  gifSrc: string | URL;
  limit: string;
  _id: string;
}
export interface ISetHPosAction {
  type: "SET_H_POS",
  payload: string;
}
export interface ISetCircleWidthAction {
  type: "SET_CIRCLE_WIDTH",
  payload: string;
}
export interface ISetVertPosAction {
  type: "SET_VERT_POS",
  payload: string;
}
export interface ISetAnimDurationAction {
  type: "SET_ANIM_DUR",
  payload: string;
}
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
| "LOGIN_PASSWORD_CHANGE"

export type ILoginFormActionPayloads =
| ILoginUsernameOrEmailChangeAction["payload"]
| ILoginPasswordChangeAction["payload"]

export interface ILoginFormAction {
  type: ILoginFormActionTypes;
  payload: ILoginFormActionPayloads;
}
export interface ILoginUsernameOrEmailChangeAction {
  type: "LOGIN_EMAIL_OR_USERNAME_CHANGE";
  payload: string;
}
export interface ILoginPasswordChangeAction {
  type: "LOGIN_PASSWORD_CHANGE";
  payload: string;
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
| "SIGNUP_EMAIL_CHANGE"
| "SIGNUP_PASSWORD_CHANGE";

export type ISignupFormActionPayloads =
| ISignupEmailChangeAction["payload"]
| ISignupUsernameChangeAction["payload"]
| ISignupPasswordChangeAction["payload"];

export interface ISignupFormAction {
  type: ISignupFormActionTypes
  payload: ISignupFormActionPayloads
}

export interface ISignupUsernameChangeAction {
  type: "SIGNUP_USERNAME_CHANGE";
  payload: string;
}
export interface ISignupEmailChangeAction {
  type: "SIGNUP_EMAIL_CHANGE";
  payload: string;
}
export interface ISignupPasswordChangeAction {
  type: "SIGNUP_PASSWORD_CHANGE";
  payload: string;
}

export interface IArtScrollerState {
  gifs: Array<IGif>;
  animDuration: string;
  vertPos: string;
  hPos: string;
  circleWidth: string;
  invert: string;
  figureOn: boolean;
}

export type IArtScrollerActionTypes = 
| IGetGifsAction["type"]
| ISetAnimDurationAction["type"]
| ISetVertPosAction["type"]
| ISetHPosAction["type"]
| ISetCircleWidthAction["type"]

export type IArtScrollerPayloads = 
| IGetGifsAction["payload"]
| ISetAnimDurationAction["payload"]
| ISetVertPosAction["payload"]
| ISetHPosAction["payload"]
| ISetCircleWidthAction["payload"]

export interface IArtScrollerAction {
  type: IArtScrollerActionTypes;
  payload: IArtScrollerPayloads
}

export interface ILedSetStyleAction {
  type: "SET_STYLE";
  payload: string;
}
export interface ILedClearStyleAction {
  type: "CLEAR_STYLE";
  payload: "";
}

export interface ILedStyleTagState {
  html: string
}

export type ILedStyleTagActionTypes = 
| "SET_STYLE"
| "CLEAR_STYLE"

export type ILedStyleTagActionPayloads =
| ILedSetStyleAction["payload"]
| ILedClearStyleAction["payload"];

export interface ILedStyleAction {
  type: ILedStyleTagActionTypes
  payload: ILedStyleTagActionPayloads
}
export interface ILoggedInState {
  loggedIn: boolean;
}
export interface ILoggedinAction {
  type: ILoggedInActionTypes,
  payload: ILoggedInActionPayloads
}

export type ILoggedInActionTypes = 
| "LOG_IN"
| "LOG_OUT";

export type ILoggedInActionPayloads =
| ILoginAction["payload"]
| ILogoutAction["payload"];
export interface ILoginAction {
  type: "LOG_IN";
  payload: true;
}
export interface ILogoutAction {
  type: "LOG_OUT";
  payload: false;
}
export interface MyRootState {
  ledState: ILedState;
  loggedInState: ILoggedInState;
  ledStyleTagState: ILedStyleTagState;
  loginFormState: ILoginFormState;
  signupFormState: ISignupFormState;
  artScrollerState: IArtScrollerState;
}
