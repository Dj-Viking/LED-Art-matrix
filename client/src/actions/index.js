export const login = () => {
  return {
    type: 'LOGIN'
  };
};
export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

//LED CHANGE ACTIONS
export const loadUserSplashConfig = (preset) => {
  return {
    type: 'LOAD_USER_SPLASH_CONFIG',
    red: preset.red,
    green: preset.green,
    blue: preset.blue,
    alpha: preset.alpha
  };
};
export const fadeUpRed = (data) => {
  return {
    type: 'FADE_UP_RED',
    payload: data.red
  };
};
export const fadeDownRed = (data) => {
  return {
    type: 'FADE_DOWN_RED',
    payload: data.red
  };
};
export const fadeUpGreen = (data) => {
  return {
    type: 'FADE_UP_GREEN',
    payload: data.green
  };
};
export const fadeDownGreen = (data) => {
  return {
    type: 'FADE_DOWN_GREEN',
    payload: data.green
  };
};
export const fadeUpBlue = (data) => {
  return {
    type: 'FADE_UP_BLUE',
    payload: data.blue
  };
};
export const fadeDownBlue = (data) => {
  return {
    type: 'FADE_DOWN_BLUE',
    payload: data.blue
  };
};

//SKETCH ONE AND TWO ACTIONS
export const sketchOneOn = (data) => {
  return {
    type: 'SKETCH_ONE_ON',
    payload: data
  };
};
export const sketchTwoOn = (data) => {
  return {
    type: 'SKETCH_TWO_ON',
    payload: data
  };
};
