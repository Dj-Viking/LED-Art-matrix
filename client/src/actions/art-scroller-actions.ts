// some condition preventing to be on...
// false by default

import {
    ISetHPosAction,
    ISetFigureOnAction,
    ISetInvertAction,
    ISetCircleWidthAction,
    ISetVertPosAction,
    ISetGifsAction,
    IGif,
    ISetAnimDurationAction,
    ISetListNameAction,
} from "../types";

// ACTIVATE ON THE RETURN OF API QUERY DATA
export const setListName = (name: string): ISetListNameAction => ({
    type: "SET_LIST_NAME",
    payload: name,
});
export const setGifs = (data: Array<IGif>): ISetGifsAction => ({
    type: "SET_GIFS",
    payload: data,
});
export const setAnimDuration = (duration: string): ISetAnimDurationAction => ({
    type: "SET_ANIM_DUR",
    payload: duration,
});
export const setVertPos = (pos: string): ISetVertPosAction => ({
    type: "SET_VERT_POS",
    payload: pos,
});
export const setHPos = (pos: string): ISetHPosAction => ({
    type: "SET_H_POS",
    payload: pos,
});
export const setCircleWidth = (width: string): ISetCircleWidthAction => ({
    type: "SET_CIRCLE_WIDTH",
    payload: width,
});
export const setInvert = (invert: string): ISetInvertAction => ({
    type: "SET_INVERT",
    payload: invert,
});
export const setFigureOn = (on: boolean): ISetFigureOnAction => ({
    type: "TOGGLE_FIGURE",
    payload: on,
});
