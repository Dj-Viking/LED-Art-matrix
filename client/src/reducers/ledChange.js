const ledChangeReducer = (
  state = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
    presetName: '',
    presetSpeed: 0,
    isAnimating: false
  },
  action) => 
{
  switch(action.type) {

    case 'LOAD_USER_SPLASH_CONFIG':
      let newState = {...action.payload}
      return {
        ...state,
        // red: action.red,
        // green: action.green,
        // blue: action.blue,
        // alpha: action.alpha,
        // presetName: action.presetName,
        // isAnimating: action.isAnimating
        newState
      }
    case 'PRESET_SWITCH':
      return {
        ...state,
        isAnimating: action.payload.isAnimating,
        presetName: action.payload.presetName
      }
    case 'PRESET_SPEED_CHANGE':
      return {
        ...state,
        isAnimating: true,
        presetSpeed: action.payload
      }
    case 'IS_ANIMATING':
      //on mouse up
      //after some time after stopping animation on click 
      return {
        ...state,
        isAnimating: action.payload
      }
    case 'STOP_ANIMATING':
      //on click happen first before preset animation starts again
      // happens immediately
      return {
        ...state,
        isAnimating: action.payload
      }
    case 'RED_FADER_CHANGE':
      return {
        ...state,
        red: action.payload
      }
    case 'GREEN_FADER_CHANGE':
      return {
        ...state,
        green: action.payload
      }
    case 'BLUE_FADER_CHANGE':
      return {
        ...state,
        blue: action.payload
      }
    case 'ALPHA_FADER_CHANGE':
      return {
        ...state,
        alpha: action.payload
      }
    default: return state
  }
};

export default ledChangeReducer;