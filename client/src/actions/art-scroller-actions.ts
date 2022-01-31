// some condition preventing to be on...
// false by default

import { ISetHPosAction, ISetInvertAction, ISetCircleWidthAction, ISetVertPosAction, IGetGifsAction, IGif, ISetAnimDurationAction } from "../types";

// ACTIVATE ON THE RETURN OF API QUERY DATA
export const getGifs = (data: Array<IGif>): IGetGifsAction => ({
  type: "GET_GIFS",
  payload: data
});
export const setAnimDuration = (duration: string): ISetAnimDurationAction => ({
  type: "SET_ANIM_DUR",
  payload: duration
});
export const setVertPos = (pos: string): ISetVertPosAction => ({
  type: "SET_VERT_POS",
  payload: pos
});
export const setHPos = (pos: string): ISetHPosAction => ({
  type: "SET_H_POS",
  payload: pos
});
export const setCircleWidth = (width: string): ISetCircleWidthAction => ({
  type: "SET_CIRCLE_WIDTH",
  payload: width
});
export const setInvert = (invert: string): ISetInvertAction => ({
  type: "SET_INVERT",
  payload: invert
});
