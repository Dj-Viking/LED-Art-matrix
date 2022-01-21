import { ILedClearStyleAction, ILedSetStyleAction } from "../types";

export function setLedStyle(css: string): ILedSetStyleAction {
  return {
    type: "SET_STYLE",
    payload: css
  };
}

export function clearStyle(): ILedClearStyleAction {
  return {
    type: "CLEAR_STYLE",
    payload: ""
  };
}