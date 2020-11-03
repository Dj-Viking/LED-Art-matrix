const ledChangeReducer = (
  state = {
    alpha: 1,
    presetName: '',
    animationDurationState: '4s',
    animationDelayState: '.5s',
  },
  action) => 
{
  switch(action.type) {

    case 'LOAD_USER_SPLASH_CONFIG':
      let newState = {
        alpha: action.payload.alpha,
        presetName: action.payload.presetName,
        animationDurationState: action.payload.animationDuration,
        animationDelayState: action.payload.animationDelay,
      }
      return {
        ...state,
        // alpha: action.payload.alpha,
        // presetName: action.payload.presetName,
        // animationSpeed: action.payload.animationSpeed,
        // animationDelay: action.payload.animationDelay,
        // isAnimating: action.payload.isAnimating
        newState
      }
    case 'PRESET_SWITCH':
      return {
        ...state,
        presetName: action.payload
      }
    case 'ANIMATION_DELAY_CHANGE':
      return {
        ...state,
        animationDelayState: action.payload
      }
    case 'ANIMATION_DURATION_CHANGE':
      return {
        ...state,
        animationDurationState: action.payload
      }
    case 'STOP_ANIMATING':
      //on click happen first before preset animation starts again
      // happens immediately
      return {
        ...state,
        isAnimating: action.payload
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