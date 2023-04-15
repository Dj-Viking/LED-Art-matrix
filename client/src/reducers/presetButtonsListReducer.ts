import { IPresetButtonsAction, IPresetButtonsListState, IPresetButton } from "../types";

const presetButtonsListReducer = (
    state: IPresetButtonsListState = {
        midiMode: false,
        presetButtons: [],
    },
    action: IPresetButtonsAction
): IPresetButtonsListState => {
    switch (action.type) {
        case "SET_ACTIVE_BUTTON":
            return {
                ...state,
                presetButtons: state.presetButtons.map((button) => {
                    if (!button.isActive && button.id === (action.payload as string)) {
                        button.isActive = true;
                        return button;
                    } else {
                        button.isActive = false;
                        return button;
                    }
                }),
            };
        case "TOGGLE_MIDI_MODE":
            return {
                ...state,
                midiMode: !state.midiMode as boolean,
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
