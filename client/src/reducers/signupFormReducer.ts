import { ISignupEmailChangeAction, ISignupFormAction, ISignupFormState, ISignupPasswordChangeAction, ISignupUsernameChangeAction } from "../types";

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
    case "SIGNUP_EMAIL_CHANGE":
      return {
        ...state,
        email: action.payload as ISignupEmailChangeAction["payload"]
      };
    case "SIGNUP_PASSWORD_CHANGE":
      return {
        ...state,
        password: action.payload as ISignupPasswordChangeAction["payload"]
      };
    default: return state;
  }
};

export default signupFormReducer;
