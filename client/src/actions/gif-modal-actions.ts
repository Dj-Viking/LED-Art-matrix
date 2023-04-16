import { SetGifsModalIsOpen, SetGifsModalContextAction } from "../types";
export const setGifModalIsOpen: SetGifsModalIsOpen = (open) => {
    return {
        type: "SET_GIFS_MODAL_OPEN",
        payload: open,
    };
};
export const setGifModalContext: SetGifsModalContextAction = (ctx) => {
    return {
        type: "SET_GIFS_MODAL_CONTEXT",
        payload: ctx,
    };
};
