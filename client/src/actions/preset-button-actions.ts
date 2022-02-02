import { ICheckPresetButtonsActiveAction, ISetPresetButtonsListAction, IPresetButton } from "../types";

export const setPresetButtonsList = (buttons: IPresetButton[]): ISetPresetButtonsListAction => ({
  type: "SET_BUTTONS_LIST",
  payload: buttons
}); 
export const checkPresetButtonsActive: ICheckPresetButtonsActiveAction = (buttons: IPresetButton[], id: string) => {
  
  let newButtons = [];

  newButtons = buttons.map((btn: IPresetButton) => {
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
    payload: newButtons
  };
};