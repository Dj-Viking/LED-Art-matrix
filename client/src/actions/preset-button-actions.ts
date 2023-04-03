import {
    ICheckPresetButtonsActiveAction,
    ISetPresetButtonsListAction,
    IPresetButton,
    ISetAllInactiveAction,
    IDeletePresetAction,
    IToggleKeybindConfigAction,
} from "../types";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";

export const setPresetButtonsList = (
    buttons: IPresetButton[] | []
): ISetPresetButtonsListAction => ({
    type: "SET_BUTTONS_LIST",
    payload: buttons,
});

export const toggleKeyBindConfig: IToggleKeybindConfigAction = (buttons) => {
    let newList = [];

    newList = buttons.map((btn, index) => {
        if (btn.keyBinding !== "midi") {
            btn.keyBinding = "midi";
        } else {
            btn.keyBinding = PresetButtonsList.createKeyBinding(index);
        }
        return btn;
    });

    return {
        type: "TOGGLE_KEYBIND_CONFIG",
        payload: newList,
    };
};

export const checkPresetButtonsActive: ICheckPresetButtonsActiveAction = (
    buttons: IPresetButton[],
    id: string
) => {
    let newList = [];

    newList = buttons.map((btn: IPresetButton) => {
        switch (true) {
            case btn.id === id && btn.isActive: {
                btn.isActive = true;
                return btn;
            }
            case btn.isActive && btn.id !== id: {
                btn.isActive = false;
                return btn;
            }
            case !btn.isActive && btn.id === id: {
                btn.isActive = true;
                return btn;
            }
            default:
                return btn;
        }
    });

    return {
        type: "CHECK_BUTTONS_ACTIVE",
        payload: newList,
    };
};

export const setAllInactive: ISetAllInactiveAction = (buttons: IPresetButton[]) => {
    let newList = [];

    newList = buttons.map((btn) => {
        btn.isActive = false;
        return btn;
    });
    return {
        type: "SET_ALL_INACTIVE",
        payload: newList,
    };
};

export const deletePreset = (buttons: IPresetButton[], id: string): IDeletePresetAction => {
    let newList = [];

    newList = buttons.filter((btn) => btn.id !== id);

    return {
        type: "DELETE_PRESET",
        payload: newList,
    };
};
