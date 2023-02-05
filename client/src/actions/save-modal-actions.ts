import { ISetSaveModalContextAction, ISetSaveModalIsOpenAction } from "../types";
export const setSaveModalIsOpen = (open: boolean): ISetSaveModalIsOpenAction => {
    return {
        type: "SET_SAVE_MODAL_OPEN",
        payload: open,
    };
};
export const setSaveModalContext = (context: {
    animVarCoeff: string;
    presetName?: string;
}): ISetSaveModalContextAction => {
    const { animVarCoeff, presetName } = context;
    return {
        type: "SET_SAVE_MODAL_CONTEXT",
        payload: {
            animVarCoeff,
            presetName: presetName || "",
        },
    };
};
