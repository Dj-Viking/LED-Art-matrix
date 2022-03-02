import { ISetAccessRecordAction } from "../types";
import { MIDIController, MIDIAccessRecord } from "../utils/MIDIControlClass";

// @ts-ignore
export const setAccess: ISetAccessRecordAction = (access: MIDIAccessRecord) => {

  return {
    type: "SET_ACCESS",
    payload: {...new MIDIController(access).getInstance()}
  };
};