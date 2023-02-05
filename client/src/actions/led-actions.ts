import { ILedAnimVarCoeffChangeAction, ILedPresetSwitchAction } from "../types";

// LED CHANGE ACTIONS
// export const loadUserSplashConfig = (
//   preset: { presetName: string, animationDelayState: string, animationDurationState: string }
// ): ILedLoadUserSplashConfigAction => ({
//   type: "LOAD_USER_SPLASH_CONFIG",
//   payload: {
//     presetName: preset.presetName,
//     animationDelayState: preset.animationDelayState,
//     animationDurationState: preset.animationDurationState
//   }
// });
export const presetSwitch = (preset: string): ILedPresetSwitchAction => ({
    type: "PRESET_SWITCH",
    payload: preset,
});
export const animVarCoeffChange = (coeff: string): ILedAnimVarCoeffChangeAction => ({
    type: "VAR_COEFF_CHANGE",
    payload: coeff,
});
// export const animationDurationChange = (data: string): ILedAnimationDurationChangeAction => ({
//   type: "ANIMATION_DURATION_CHANGE",
//   payload: data
// });
// export const animationDelayChange = (data: string): ILedAnimationDelayChange => ({
//   type: "ANIMATION_DELAY_CHANGE",
//   payload: data
// });
// export const alphaFaderChange = (data: string): ILedAlphaFaderChangeAction => ({
//   type: "ALPHA_FADER_CHANGE",
//   payload: data
// });
// save class property values that are changed by faders?
// animation duration
// export const savePresetName = (data: string): ILedSavePresetNameAction => ({
//   type: "SAVE_PRESET_NAME",
//   payload: data
// });
// on mouse up?? transition from position in
// animation to beginning of current animation or
