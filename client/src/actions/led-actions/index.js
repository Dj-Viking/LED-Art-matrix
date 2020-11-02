//LED CHANGE ACTIONS
export const loadUserSplashConfig = (preset) => {
  return {
    type: 'LOAD_USER_SPLASH_CONFIG',
    payload: {
      isAnimating: preset.isAnimating,
      presetName: preset.presetName
    }
  };
};
export const presetSwitch = (data) => {
  return {
    type: 'PRESET_SWITCH',
    payload: data.presetName
  };
};
export const presetSpeedChange = (data) => {
  return {
    type: 'PRESET_SPEED_CHANGE',
    payload: data.presetSpeed
  }
}
export const redFaderChange = (data) => {
  return {
    type: 'RED_FADER_CHANGE',
    payload: data.red
  };
};
export const greenFaderChange = (data) => {
  return {
    type: 'GREEN_FADER_CHANGE',
    payload: data.green
  };
};
export const blueFaderChange = (data) => {
  return {
    type: 'BLUE_FADER_CHANGE',
    payload: data.blue
  };
};
export const alphaFaderChange = (data) => {
  return {
    type: 'ALPHA_FADER_CHANGE',
    payload: data
  };
};
//save class property values that are changed by faders?
//animation duration
export const savePresetName = (data) => {
  return {
    type: 'SAVE_PRESET_NAME',
    payload: data
  };
};
//on mouse up?? transition from position in 
// animation to beginning of current animation or 
export const isAnimating = (data) => {
  return {
    type: 'IS_ANIMATING',
    payload: data
  };
};
//on click (mouse down and up)???
export const stopAnimating = (data) => {
  return {
    type: 'STOP_ANIMATING',
    payload: data
  };
};