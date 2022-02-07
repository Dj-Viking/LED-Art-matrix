import { ISetDeleteModalOpenAction } from "../types";

export const setDeleteModalOpen = (open: boolean): ISetDeleteModalOpenAction => {
  return {
    type: "SET_DELETE_MODAL_OPEN",
    payload: open
  };
};