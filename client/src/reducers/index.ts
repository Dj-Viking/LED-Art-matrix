import { combineReducers } from "redux";
import ledReducer from "./ledReducer";
import styleTagReducer from "./styleTagReducer";
import loginFormReducer from "./loginFormReducer";
import signupFormReducer from "./signupFormReducer";
import artScrollerReducer from "./artScrollerReducer";

const allReducers = combineReducers(
  {
    ledState: ledReducer,
    ledStyleTagState: styleTagReducer,
    loginFormState: loginFormReducer,
    signupFormState: signupFormReducer,
    artScrollerState: artScrollerReducer
  }
);

export default allReducers;
