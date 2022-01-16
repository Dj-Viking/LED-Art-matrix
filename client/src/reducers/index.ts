import { combineReducers } from "redux";
import ledReducer from "./ledReducer";
import loginFormReducer from "./loginFormReducer";
import signupFormReducer from "./signupFormReducer";
import artScrollerReducer from "./artScrollerReducer";

const allReducers = combineReducers(
  {
    ledState: ledReducer,
    loginFormState: loginFormReducer,
    signupFormState: signupFormReducer,
    artScrollerState: artScrollerReducer
  }
);

export default allReducers;
