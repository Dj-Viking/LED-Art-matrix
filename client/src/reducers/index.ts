import { combineReducers } from "redux";
import ledReducer from "./ledReducer";
import deleteModalReducer from "./deleteModalReducer"; 
import saveModalReducer from "./saveModalReducer"; 
import styleTagReducer from "./styleTagReducer";
import loggedInReducer from "./loggedInReducer";
import loginFormReducer from "./loginFormReducer";
import signupFormReducer from "./signupFormReducer";
import artScrollerReducer from "./artScrollerReducer";
import presetButtonsListReducer from "./presetButtonsListReducer";

const allReducers = combineReducers(
  {
    presetButtonsListState: presetButtonsListReducer,
    ledState: ledReducer,
    loggedInState: loggedInReducer,
    ledStyleTagState: styleTagReducer,
    loginFormState: loginFormReducer,
    signupFormState: signupFormReducer,
    artScrollerState: artScrollerReducer,
    deleteModalState: deleteModalReducer,
    saveModalState: saveModalReducer 
  }
);

export default allReducers;
