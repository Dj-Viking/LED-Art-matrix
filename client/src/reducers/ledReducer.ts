import { ILedAction, ILedPresetSwitchAction, ILedState } from "../types";

const ledChangeReducer = (
  state: ILedState = {
    alpha: "1",
    presetName: "",
    animationDurationState: "4s",
    animationDelayState: ".5s",
    isInverted: false
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
        presetName: action.payload as ILedPresetSwitchAction["payload"]
      };
    // case "ANIMATION_DELAY_CHANGE":
    //   return {
    //     ...state,
    //     animationDelayState: action.payload as ILedAnimationDelayChange["payload"]
    //   };
    // case "ANIMATION_DURATION_CHANGE":
    //   return {
    //     ...state,
    //     animationDurationState: action.payload as ILedAnimationDurationChangeAction["payload"]
    //   };
    // case "ALPHA_FADER_CHANGE":
    //   return {
    //     ...state,
    //     alpha: action.payload as ILedAlphaFaderChangeAction["payload"]
    //   };
    default: return state;
  }
};

export default ledChangeReducer;
