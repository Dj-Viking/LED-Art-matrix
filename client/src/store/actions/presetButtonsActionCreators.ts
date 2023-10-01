import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPresetButton, MyThunkConfig } from "../../types";
import { ApiService } from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { IDBPreset, PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { keyboardActions } from "../keyboardSlice";
import { ledActions } from "../ledSlice";
import { presetButtonsListActions } from "../presetButtonListSlice";

const moduleName = "presetButtonListSlice";

export const buildGetPresetButtonsAction = createAsyncThunk<{ presetButtons: IPresetButton[] }, void, MyThunkConfig>(
    moduleName + "/getPresets",
    async (_params, _thunkAPI) => {
        let buttons: IPresetButton[] = [];

        const dbButtons = (await ApiService.getUserPresets(AuthService.getToken() as string)) as IDBPreset[];

        const defaultPreset = await ApiService.getDefaultPreset(AuthService.getToken() as string);

        buttons = new PresetButtonsList(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                console.log("calling click hanlder of button class!!!");
                event.preventDefault();
                const isListeningForEdits = _thunkAPI.getState().keyboardState.isListeningForMappingEdit;
                const isKeyboardMapEditMode = _thunkAPI.getState().keyboardState.isListeningForMappingEdit;
                if (isListeningForEdits && isKeyboardMapEditMode) {
                    _thunkAPI.dispatch(keyboardActions.updateKeyMapping([event, event.type]));
                }
            },
            dbButtons,
            defaultPreset && defaultPreset._id ? defaultPreset._id : void 0
        ).getList();

        return {
            presetButtons: buttons,
        };
    }
);

export const buildGetDefaultPresetAction = createAsyncThunk<void, void, MyThunkConfig>(
    moduleName + "/getDefaultPreset",
    async (_params, _thunkAPI) => {
        const preset = (await ApiService.getDefaultPreset(AuthService.getToken() as string)) as IDBPreset;

        _thunkAPI.dispatch(ledActions.setAnimVarCoeff(preset.animVarCoeff));
        _thunkAPI.dispatch(ledActions.setPresetName(preset.presetName));
        _thunkAPI.dispatch(presetButtonsListActions.setActiveButton(preset._id));

        return void 0;
    }
);
