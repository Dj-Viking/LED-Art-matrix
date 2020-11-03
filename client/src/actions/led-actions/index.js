//LED CHANGE ACTIONS
export const loadUserSplashConfig = (preset) => {
  return {
    type: 'LOAD_USER_SPLASH_CONFIG',
    payload: {
      isAnimating: preset.isAnimating,
      presetName: preset.presetName,
      animationDelay: preset.animationDelay,
      animationSpeed: preset.animationSpeed
    }
  };
};
export const presetSwitch = (data) => {
  return {
    type: 'PRESET_SWITCH',
    payload: data.presetName
  };
};
export const animationSpeedChange = (data) => {
  return {
    type: 'ANIMATION_SPEED_CHANGE',
    payload: data
  }
}
export const animationDelayChange = (data) => {
  return {
    type: 'ANIMATION_DELAY_CHANGE',
    payload: data
  }
}
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