import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDeleteModalState, INewGifsModalState, ISaveModalState } from "../types";
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
        setDeleteModeIsActive: (state: CombinedModalState, action: PayloadAction<boolean>) => {
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
