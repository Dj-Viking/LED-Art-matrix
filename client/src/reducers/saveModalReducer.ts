import {
    ISaveModalState,
    ISaveModalAction,
    ISetSaveModalIsOpenAction,
    ISetSaveModalContextAction,
} from "../types";

const saveModalReducer = (
    state: ISaveModalState = {
        saveModalIsOpen: false,
        saveModalContext: { animVarCoeff: "64", presetName: "" },
    },
    action: ISaveModalAction
): ISaveModalState => {
    switch (action.type) {
        case "SET_SAVE_MODAL_OPEN":
            return {
                ...state,
                saveModalIsOpen: action.payload as ISetSaveModalIsOpenAction["payload"],
            };
        case "SET_SAVE_MODAL_CONTEXT":
            return {
                ...state,
                saveModalContext: action.payload as ISetSaveModalContextAction["payload"],
            };
        default:
            return state;
    }
};

export default saveModalReducer;
