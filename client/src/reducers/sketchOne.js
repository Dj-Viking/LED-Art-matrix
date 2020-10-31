const sketchOneReducer = (
  state = {
    isOn: false,
}, action) => {
  switch(action.type) {
    case 'SKETCH_ONE_ON':
      return {
        ...state,
        isOn: action.payload
      }
    default: return state
  };
};

export default sketchOneReducer;