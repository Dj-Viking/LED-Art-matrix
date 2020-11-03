const ledChangeReducer = (
  state = {
    alpha: 1,
    presetName: '',
    animationSpeed: '4s',
    animationDelay: '.5s',
    isAnimating: false
  },
  action) => 
{
  switch(action.type) {

    case 'LOAD_USER_SPLASH_CONFIG':
      let newState = {
        alpha: action.payload.alpha,
        presetName: action.payload.presetName,
        animationSpeed: action.payload.animationSpeed,
        animationDelay: action.payload.animationDelay,
        isAnimating: action.payload.isAnimating
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
        isAnimating: action.payload.isAnimating,
        presetName: action.payload.presetName
      }
    case 'ANIMATION_DELAY_CHANGE':
      return {
        ...state,
        animationDelay: action.payload
      }
    case 'ANIMATION_SPEED_CHANGE':
      return {
        ...state,
        animationSpeed: action.payload
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
    case 'ALPHA_FADER_CHANGE':
      return {
        ...state,
        alpha: action.payload
      }
    default: return state
  }
};

export default ledChangeReducer;