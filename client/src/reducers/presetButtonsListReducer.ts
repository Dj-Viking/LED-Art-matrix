import { IPresetButtonsAction, IPresetButtonsListState, IPresetButton } from "../types";

const presetButtonsListReducer = (
    state: IPresetButtonsListState = {
        presetButtons: [],
    },
    action: IPresetButtonsAction
): IPresetButtonsListState => {
    switch (action.type) {
        case "SET_BUTTONS_LIST":
            return {
                ...state,
                presetButtons: action.payload as IPresetButton[],
            };
        case "CHECK_BUTTONS_ACTIVE":
            return {
                ...state,
                presetButtons: action.payload as IPresetButton[],
            };
        case "SET_ALL_INACTIVE":
            return {
                ...state,
                presetButtons: action.payload as IPresetButton[],
            };
        case "DELETE_PRESET":
            return {
                ...state,
                presetButtons: action.payload as IPresetButton[],
            };
        default:
            return state;
    }
};

export default presetButtonsListReducer;
