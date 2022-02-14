import { ISetDeleteModalContextAction, ISetDeleteModalOpenAction, IToggleDeleteModeAction } from "../types";

export const setDeleteModalOpen = (open: boolean): ISetDeleteModalOpenAction => {
  return {
    type: "SET_DELETE_MODAL_OPEN",
    payload: open
  };
};
export const setDeleteModalContext = (context: { btnId: string; }): ISetDeleteModalContextAction => {
  return {
    type: "SET_DELETE_MODAL_CONTEXT",
    payload: context
  };
};

export const toggleDeleteMode: IToggleDeleteModeAction = (on: boolean) => {
  
  return {
    type: "TOGGLE_DELETE_MODE",
    payload: on,
  };

};