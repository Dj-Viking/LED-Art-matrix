import { ISetAccessRecordAction } from "../types";
import { MIDIController } from "../utils/MIDIControlClass";

// @ts-ignore
export const setAccess: ISetAccessRecordAction = (access: MIDIController) => {

  if (!access.inputs?.length) {
    return {
      type: "SET_ACCESS",
      payload: {...new MIDIController(access.getAccess())}
    };
  }

  const a = access;
  a.setInputCbs();
  a.setOutputCbs();

  return {
    type: "SET_ACCESS",
    payload: a as MIDIController | unknown
  };
};