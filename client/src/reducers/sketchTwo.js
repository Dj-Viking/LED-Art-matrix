const sketchTwoReducer = (
  state = {
    isOn: false
}, action) => {
  switch(action.type) {
    case 'SKETCH_TWO_ON':
      return {
        ...state,
        isOn: action.payload
      }
    default: return state
  };
};

export default sketchTwoReducer;