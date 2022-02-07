import { IDeleteModalState, IDeleteModalAction } from "../types";


const modalReducer = (
  state: IDeleteModalState = {
    deleteModalIsOpen: false
  }, 
  action: IDeleteModalAction
): IDeleteModalState => {
  switch (action.type) {
    case "SET_DELETE_MODAL_OPEN":
      return {
        ...state,
        deleteModalIsOpen: action.payload as boolean
      };
    default: return state;
  }
};

export default modalReducer;