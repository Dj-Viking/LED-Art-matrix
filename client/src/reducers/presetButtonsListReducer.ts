import {
    IPresetButtonsAction,
    IPresetButtonsListState,
    IPresetButton,
    IPresetButtonListActionType,
} from "../types";

const presetButtonsListReducer = (
    state: IPresetButtonsListState = {
        presetButtons: [],
    },
    action: IPresetButtonsAction<IPresetButtonListActionType>
): IPresetButtonsListState => {
    switch (action.type) {
        case "TOGGLE_KEYBIND_CONFIG":
            return {
                ...state,
                presetButtons: action.payload as IPresetButton[],
            };
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
