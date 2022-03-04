import { ISetAccessRecordAction, ISetGhostAccessInputSizeAction } from "../types";
import { MIDIConnectionEvent, MIDIController, MIDIMessageEvent } from "../utils/MIDIControlClass";

// @ts-ignore
export const setAccess: ISetAccessRecordAction = (
  access: MIDIController, 
  onmidicb: (event: MIDIMessageEvent) => unknown, 
  onstatechangecb: (event: MIDIConnectionEvent) => unknown
) => {

  if (!access.inputs?.length) {
    return {
      type: "SET_ACCESS",
      payload: {...new MIDIController(access.getAccess())}
    };
  }

  const a = access;
  a.setInputCbs(onmidicb, onstatechangecb);
  a.setOutputCbs();

  return {
    type: "SET_ACCESS",
    payload: a as MIDIController | unknown
  };
};

export const setGhostInputSize: ISetGhostAccessInputSizeAction = (access) => {
  return {
    type: "SET_ACCESS_INPUTS_SIZE",
    payload: access.inputs_size
  };
};