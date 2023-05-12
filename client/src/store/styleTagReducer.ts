import {
    ILedClearStyleAction,
    ILedSetStyleAction,
    ILedStyleAction,
    ILedStyleTagState,
} from "../types";

const styleTagReducer = (
    state: ILedStyleTagState = {
        html: "",
    },
    action: ILedStyleAction
): ILedStyleTagState => {
    switch (action.type) {
        case "SET_STYLE":
            return {
                ...state,
                html: action.payload as ILedSetStyleAction["payload"],
            };
        case "CLEAR_STYLE":
            return {
                ...state,
                html: "led1-1" as ILedClearStyleAction["payload"],
            };
        default:
            return state;
    }
};

export default styleTagReducer;
