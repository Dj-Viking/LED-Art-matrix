const ledChangeReducer = (
  state = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
  },
  action) => 
{
  switch(action.type) {

    case 'LOAD_USER_SPLASH_CONFIG':
      return {
        ...state,
        red: action.red,
        green: action.green,
        blue: action.blue,
        alpha: action.alpha
      }
    case 'FADE_UP_RED':
      return {
        ...state,
        red: action.payload
      }
    case 'FADE_UP_GREEN':
      return {
        ...state,
        green: action.payload
      }
    case 'FADE_UP_BLUE':
      return {
        ...state,
        blue: action.payload
      }
    case 'FADE_DOWN_RED': 
      return {
        ...state,
        red: action.payload
      }
    case 'FADE_DOWN_GREEN': 
      return {
        ...state,
        green: action.payload
      }
    case 'FADE_DOWN_BLUE': 
      return {
        ...state,
        blue: action.payload
      }
    default: return state
  }
};

export default ledChangeReducer;