import { ICheckPresetButtonsActiveAction, ISetPresetButtonsListAction, IPresetButton, ISetAllInactiveAction } from "../types";

export const setPresetButtonsList = (buttons: IPresetButton[]): ISetPresetButtonsListAction => ({
  type: "SET_BUTTONS_LIST",
  payload: buttons
}); 
export const checkPresetButtonsActive: ICheckPresetButtonsActiveAction = (buttons: IPresetButton[], id: string) => {
  
  let newList = [];

  newList = buttons.map((btn: IPresetButton) => {
    switch(true) {
      case btn.id === id && btn.isActive: {
        btn.isActive = false;
        return btn;
      }
      case btn.isActive && btn.id !== id: {
        btn.isActive = false;
        return btn;
      }
      case !btn.isActive && btn.id === id: {
        btn.isActive = true;
        return btn;
      }
      default: return btn;
    }
  });

  return {
    type: "CHECK_BUTTONS_ACTIVE",
    payload: newList
  };
};

export const setAllInactive: ISetAllInactiveAction = (buttons: IPresetButton[]) => {
  let newList = [];

  newList = buttons.map(btn => {
    btn.isActive = false;
    return btn;
  });
  return {
    type: "SET_ALL_INACTIVE",
    payload: newList
  };
};