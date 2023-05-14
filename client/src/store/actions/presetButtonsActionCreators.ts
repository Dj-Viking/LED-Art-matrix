import { createAsyncThunk } from "@reduxjs/toolkit";
import { MyThunkConfig } from "../../types";
import { ApiService } from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { IDBPreset } from "../../utils/PresetButtonsListClass";
import { ledActions } from "../ledSlice";
import { LedStyleEngine } from "../../utils/LedStyleEngineClass";

const moduleName = "presetButtonListSlice";

export const buildGetDefaultPresetAction = createAsyncThunk<string, void, MyThunkConfig>(
    moduleName + "/midiAccess",
    async (_params, _thunkAPI) => {
        const preset = (await ApiService.getDefaultPreset(
            AuthService.getToken() as string
        )) as IDBPreset;

        _thunkAPI.dispatch(ledActions.setAnimVarCoeff(preset.animVarCoeff as string));
        _thunkAPI.dispatch(ledActions.setPresetName(preset.presetName));
        _thunkAPI.dispatch(
            ledActions.setLedStyle(
                new LedStyleEngine(preset.presetName).createStyleSheet(preset.animVarCoeff)
            )
        );

        return preset.presetName;
    }
);
