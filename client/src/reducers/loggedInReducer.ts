import { ILoggedinAction, ILoggedInState, ILogoutAction, ILoginAction } from "../types";

const loggedInReducer = (
    state: ILoggedInState = {
        loggedIn: false,
    },
    action: ILoggedinAction
): ILoggedInState => {
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                loggedIn: action.payload as ILoginAction["payload"],
            };
        case "LOG_OUT":
            return {
                ...state,
                loggedIn: action.payload as ILogoutAction["payload"],
            };
        default:
            return state;
    }
};

export default loggedInReducer;
