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

type State =
    | "presetButtonsListState"
    | "ledState"
    | "loggedInState"
    | "ledStyleTagState"
    | "loginFormState"
    | "signupFormState"
    | "artScrollerState"
    | "deleteModalState"
    | "saveModalState"
    | "accessRecordState";

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

    let ret: GlobalState;
    ret = {} as any;

    Object.keys(state).forEach((_key: string) => {
        let state_key = _key as keyof MyRootState;
        Object.keys(state[state_key]).forEach((__key: string) => {
            let key = __key as any;
            // @ts-ignore this works just fine - i can't make a type for this easily
            // spreading the keys and values of each state object into just one global state object
            // and make it type safe... yet
            ret[key] = state[state_key as keyof MyRootState][key as any];
        });
    });

    return ret;
}

const combinedReducers = combineReducers(reducers);

export type { State };
export { combinedReducers, reducers, getGlobalState };
