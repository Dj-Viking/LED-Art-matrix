import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPresetButton, MyThunkConfig } from "../../types";
import { ApiService } from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { IDBPreset, PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { ledActions } from "../ledSlice";
import { LedStyleEngine } from "../../utils/LedStyleEngineClass";
import { presetButtonsListActions } from "../presetButtonListSlice";
import { keyGen } from "../../utils/keyGen";

const moduleName = "presetButtonListSlice";

export const buildGetPresetButtonsAction = createAsyncThunk<
    { presetButtons: IPresetButton[] },
    void,
    MyThunkConfig
>(moduleName + "/getPresets", async (_params, _thunkAPI) => {
    let buttons: IPresetButton[] = [];
    if (AuthService.loggedIn()) {
        const dbButtons = (await ApiService.getUserPresets(
            AuthService.getToken() as string
        )) as IDBPreset[];
        const defaultPreset = await ApiService.getDefaultPreset(AuthService.getToken() as string);
        buttons = new PresetButtonsList(
            (event: any) => {
                event.preventDefault();
            },
            dbButtons,
            defaultPreset && defaultPreset._id ? defaultPreset._id : void 0
        ).getList();
    } else {
        const presetNames = ["rainbowTest", "v2", "waves", "spiral", "fourSpirals", "dm5"];

        const tempPresets = presetNames.map((name) => {
            return {
                _id: keyGen(),
                presetName: name,
                displayName: name,
                animVarCoeff: "64",
            } as IDBPreset;
        });

        buttons = new PresetButtonsList((event: any) => {
            event.preventDefault();
        }, tempPresets).getList() as IPresetButton[];
    }
    return {
        presetButtons: buttons,
    };
});

export const buildGetDefaultPresetAction = createAsyncThunk<void, void, MyThunkConfig>(
    moduleName + "/getDefaultPreset",
    async (_params, _thunkAPI) => {
        const preset = (await ApiService.getDefaultPreset(
            AuthService.getToken() as string
        )) as IDBPreset;

        _thunkAPI.dispatch(ledActions.setAnimVarCoeff(preset.animVarCoeff));
        _thunkAPI.dispatch(ledActions.setPresetName(preset.presetName));
        _thunkAPI.dispatch(
            ledActions.setLedStyle(
                new LedStyleEngine(preset.presetName).createStyleSheet(preset.animVarCoeff)
            )
        );
        _thunkAPI.dispatch(presetButtonsListActions.setActiveButton(preset._id));

        return void 0;
    }
);
