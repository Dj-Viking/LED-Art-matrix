import { combineReducers, ReducersMapObject } from "redux";
import ledReducer from "./ledReducer";
import deleteModalReducer from "./deleteModalReducer";
import saveModalReducer from "./saveModalReducer";
import styleTagReducer from "./styleTagReducer";
import loggedInReducer from "./loggedInReducer";
import loginFormReducer from "./loginFormReducer";
import signupFormReducer from "./signupFormReducer";
import artScrollerReducer from "./artScrollerReducer";
import presetButtonsListReducer from "./presetButtonsListReducer";
import accessRecordReducer from "./accessRecordReducer";
import { GlobalState, MyRootState } from "../types";
import { useSelector } from "react-redux";

const reducers = {
    presetButtonsListState: presetButtonsListReducer,
    ledState: ledReducer,
    loggedInState: loggedInReducer,
    ledStyleTagState: styleTagReducer,
    loginFormState: loginFormReducer,
    signupFormState: signupFormReducer,
    artScrollerState: artScrollerReducer,
    deleteModalState: deleteModalReducer,
    saveModalState: saveModalReducer,
    accessRecordState: accessRecordReducer,
} as ReducersMapObject<any, any>;

function getGlobalState(selectorFn: typeof useSelector): GlobalState {
    const state = selectorFn((state: MyRootState) => state);

    let ret = {} as GlobalState;

    for (const stateKey of Object.keys(state)) {
        for (const stateValueKey of Object.keys(state[stateKey])) {
            ret[stateValueKey] = state[stateKey][stateValueKey];
        }
    }

    return ret;
}

const combinedReducers = combineReducers(reducers);

export { combinedReducers, reducers, getGlobalState };
