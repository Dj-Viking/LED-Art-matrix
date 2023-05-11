import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDeleteModalState, IGif, INewGifsModalState, ISaveModalState } from "../types";
import { produce } from "immer";

export type CombinedModalState = ISaveModalState & IDeleteModalState & INewGifsModalState;

const initialState: CombinedModalState = {
    gifsModalContext: {
        gif: {} as any,
        listName: "",
    },
    gifsModalIsOpen: false,
    saveModalContext: {
        animVarCoeff: "",
        presetName: "",
    },
    saveModalIsOpen: false,
    deleteModalContext: {
        btnId: "",
        displayName: "",
    },
    deleteModalIsOpen: false,
    deleteModeActive: false,
};

export const modalSlice = createSlice({
    name: "modalSlice",
    initialState,
    reducers: {
        setGifModalIsOpen: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                draft.gifsModalIsOpen = action.payload;
            });
        },
        setGifModalContext: (
            state: CombinedModalState,
            action: PayloadAction<{ listName: string; gif: IGif }>
        ) => {
            return produce(state, (draft) => {
                draft.gifsModalContext.gif = action.payload.gif;
                draft.gifsModalContext.listName = action.payload.listName;
            });
        },
        setDeleteModalOpen: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                draft.deleteModalIsOpen = action.payload;
            });
        },
        setDeleteModalContext: (
            state: CombinedModalState,
            action: PayloadAction<{ btnId: string; displayName: string }>
        ) => {
            return produce(state, (draft) => {
                draft.deleteModalContext.btnId = action.payload.btnId;
                draft.deleteModalContext.displayName = action.payload.displayName;
            });
        },
        toggleDeleteMode: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                draft.deleteModeActive = action.payload;
            });
        },
        setSaveModalIsOpen: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                draft.saveModalIsOpen = action.payload;
            });
        },
        setSaveModalContext: (
            state: CombinedModalState,
            action: PayloadAction<ISaveModalState["saveModalContext"]>
        ) => {
            return produce(state, (draft) => {
                draft.saveModalContext = action.payload;
            });
        },
    },
});

export const modalActions = {
    ...modalSlice.actions,
};
