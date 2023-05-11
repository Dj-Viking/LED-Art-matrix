import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDeleteModalState, INewGifsModalState, ISaveModalState } from "../types";
import { produce } from "immer";

const initialState: ISaveModalState & IDeleteModalState & INewGifsModalState = {
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
        setDeleteModeIsActive: (state: IDeleteModalState, action: PayloadAction<boolean>) => {
            produce(state, (draft) => {
                draft.deleteModeActive = action.payload;
            });
        },
        setSaveModalIsOpen: (state: ISaveModalState, action: PayloadAction<boolean>) => {
            produce(state, (draft) => {
                draft.saveModalIsOpen = action.payload;
            });
        },
        setSaveModalContext: (
            state: ISaveModalState,
            action: PayloadAction<ISaveModalState["saveModalContext"]>
        ) => {
            produce(state, (draft) => {
                draft.saveModalContext = action.payload;
            });
        },
    },
});

export const modalActions = {
    ...modalSlice.actions,
};
