import { ILoginAction, ILogoutAction } from "../types";

export function login(): ILoginAction {
    return {
        type: "LOG_IN",
        payload: true,
    };
}

export function logout(): ILogoutAction {
    return {
        type: "LOG_OUT",
        payload: false,
    };
}
