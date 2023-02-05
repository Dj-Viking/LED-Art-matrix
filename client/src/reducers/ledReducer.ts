import {
    ILedAction,
    ILedAnimVarCoeffChangeAction,
    ILedPresetSwitchAction,
    ILedState,
} from "../types";

const ledChangeReducer = (
    state: ILedState = {
        alpha: "1",
        presetName: "",
        animationDurationState: "4s",
        animVarCoeff: "64",
        isInverted: false,
    },
    action: ILedAction
): ILedState => {
    switch (action.type) {
        // case "LOAD_USER_SPLASH_CONFIG":
        //   return {
        //     ...state,
        //     ...action.payload as ILedLoadUserSplashConfigAction["payload"]
        //   };
        case "PRESET_SWITCH":
            return {
                ...state,
                presetName: action.payload as ILedPresetSwitchAction["payload"],
            };
        case "VAR_COEFF_CHANGE":
            return {
                ...state,
                animVarCoeff: action.payload as ILedAnimVarCoeffChangeAction["payload"],
            };
        // case "ALPHA_FADER_CHANGE":
        //   return {
        //     ...state,
        //     alpha: action.payload as ILedAlphaFaderChangeAction["payload"]
        //   };
        default:
            return state;
    }
};

export default ledChangeReducer;
