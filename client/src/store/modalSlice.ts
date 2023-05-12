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
            return produce(state, () => {
                state.gifsModalIsOpen = action.payload;
            });
        },
        setGifModalContext: (
            state: CombinedModalState,
            action: PayloadAction<{ listName: string; gif: IGif }>
        ) => {
            return produce(state, () => {
                state.gifsModalContext.gif = action.payload.gif;
                state.gifsModalContext.listName = action.payload.listName;
            });
        },
        setDeleteModalOpen: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.deleteModalIsOpen = action.payload;
            });
        },
        setDeleteModalContext: (
            state: CombinedModalState,
            action: PayloadAction<{ btnId: string; displayName: string }>
        ) => {
            return produce(state, () => {
                state.deleteModalContext.btnId = action.payload.btnId;
                state.deleteModalContext.displayName = action.payload.displayName;
            });
        },
        toggleDeleteMode: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.deleteModeActive = action.payload;
            });
        },
        setSaveModalIsOpen: (state: CombinedModalState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.saveModalIsOpen = action.payload;
            });
        },
        setSaveModalContext: (
            state: CombinedModalState,
            action: PayloadAction<ISaveModalState["saveModalContext"]>
        ) => {
            return produce(state, () => {
                state.saveModalContext = action.payload;
            });
        },
    },
});

export const modalActions = {
    ...modalSlice.actions,
};
