import {
    ILoginFormAction,
    ILoginFormState,
    ILoginPasswordChangeAction,
    ILoginUsernameOrEmailChangeAction,
} from "../types";

const loginFormReducer = (
    state: ILoginFormState = {
        usernameOrEmail: "",
        emailIsComplete: false,
        password: "",
        passwordIsComplete: false,
    },
    action: ILoginFormAction
): ILoginFormState => {
    switch (action.type) {
        case "LOGIN_EMAIL_OR_USERNAME_CHANGE":
            return {
                ...state,
                usernameOrEmail: action.payload as ILoginUsernameOrEmailChangeAction["payload"],
            };
        case "LOGIN_PASSWORD_CHANGE":
            return {
                ...state,
                password: action.payload as ILoginPasswordChangeAction["payload"],
            };
        default:
            return state;
    }
};

export default loginFormReducer;
