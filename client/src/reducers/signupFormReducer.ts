import { ISignupEmailChangeAction, ISignupEmailCompletedAction, ISignupFormAction, ISignupFormState, ISignupPasswordChangeAction, ISignupPasswordCompletedAction, ISignupUsernameChangeAction, ISignupUsernameCompletedAction } from "../types";

const signupFormReducer = (
  state: ISignupFormState = {
    username: "",
    usernameIsComplete: false,
    email: "",
    emailIsComplete: false,
    password: "",
    passwordIsComplete: false
  }, 
  action: ISignupFormAction
): ISignupFormState => {
  switch (action.type) {
    case "SIGNUP_USERNAME_CHANGE":
      return {
        ...state,
        username: action.payload as ISignupUsernameChangeAction["payload"]
      };
    case "SIGNUP_USERNAME_COMPLETED":
      return {
        ...state,
        usernameIsComplete: action.payload as ISignupUsernameCompletedAction["payload"]
      };
    case "SIGNUP_EMAIL_CHANGE":
      return {
        ...state,
        email: action.payload as ISignupEmailChangeAction["payload"]
      };
    case "SIGNUP_EMAIL_COMPLETED":
      return {
        ...state,
        emailIsComplete: action.payload as ISignupEmailCompletedAction["payload"]
      };
    case "SIGNUP_PASSWORD_CHANGE":
      return {
        ...state,
        password: action.payload as ISignupPasswordChangeAction["payload"]
      };
    case "SIGNUP_PASSWORD_COMPLETED":
      return {
        ...state,
        passwordIsComplete: action.payload as ISignupPasswordCompletedAction["payload"]
      };
    default: return state;
  }
};

export default signupFormReducer;
