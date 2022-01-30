import { IArtScrollerAction, IArtScrollerState } from "../types";

const artScrollerReducer = (
  state: IArtScrollerState = {
    gifs: [],
    animDuration: "30",
    vertPos: "50",
    hPos: "40",
    circleWidth: "30",
    invert: 0,
    figureOn: false,
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
