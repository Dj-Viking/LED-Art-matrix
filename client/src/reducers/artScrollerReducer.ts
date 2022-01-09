import { IArtScrollerAction, IArtScrollerState } from "../types";

const artScrollerReducer = (
  state: IArtScrollerState = {
    gifs: [],
  },
  action: IArtScrollerAction
): IArtScrollerState => {
  switch (action.type) {
    case "GET_GIFS":
      return {
        ...state,
        gifs: action.payload
      };
    default: return state;
  }
};

export default artScrollerReducer;
