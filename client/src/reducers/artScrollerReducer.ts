import { IArtScrollerAction, IArtScrollerState, IGetGifsAction, ISetAnimDurationAction, ISetFigureOnAction, ISetHPosAction, ISetInvertAction, ISetVertPosAction } from "../types";

const artScrollerReducer = (
  state: IArtScrollerState = {
    gifs: [],
    animDuration: "30",
    vertPos: "50",
    hPos: "40",
    circleWidth: "30",
    invert: "0",
    figureOn: false,
  },
  action: IArtScrollerAction
): IArtScrollerState => {
  switch (action.type) {
    case "GET_GIFS":
      return {
        ...state,
        gifs: action.payload as IGetGifsAction["payload"]
      };
    case "SET_ANIM_DUR":
      return {
        ...state,
        animDuration: action.payload as ISetAnimDurationAction["payload"]
      };
    case "SET_VERT_POS":
      return {
        ...state,
        vertPos: action.payload as ISetVertPosAction["payload"]
      };
    case "SET_H_POS":
      return {
        ...state,
        hPos: action.payload as ISetHPosAction["payload"]
      };
    case "SET_CIRCLE_WIDTH":
      return {
        ...state,
        circleWidth: action.payload as ISetHPosAction["payload"]
      };
    case "SET_INVERT":
      return {
        ...state,
        invert: action.payload as ISetInvertAction["payload"]
      };
    case "TOGGLE_FIGURE":
      return {
        ...state,
        figureOn: action.payload as ISetFigureOnAction["payload"]
      };
    default: return state;
  }
};

export default artScrollerReducer;
