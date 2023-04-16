import {
    INewGifsModalState,
    INewGifsModalAction,
    ISetGifsModalContextAction,
    ISetGifsModalIsOpenAction,
    IGif,
} from "../types";

const saveModalReducer = (
    state: INewGifsModalState = {
        gifsModalIsOpen: false,
        gifsModalContext: { listName: "", gif: {} as any },
    },
    action: INewGifsModalAction
): INewGifsModalState => {
    switch (action.type) {
        case "SET_GIFS_MODAL_OPEN":
            return {
                ...state,
                gifsModalIsOpen: action.payload as ISetGifsModalIsOpenAction["payload"] as boolean,
            };
        case "SET_GIFS_MODAL_CONTEXT":
            return {
                ...state,
                gifsModalContext: action.payload as ISetGifsModalContextAction["payload"] as {
                    listName: string;
                    gif: IGif;
                },
            };
        default:
            return state;
    }
};

export default saveModalReducer;
