import { ISetAccessRecordAction, IDetermineDeviceControlAction } from "../types";
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
            payload: { ...new MIDIController(access.getAccess()) },
        };
    }

    const a = access;
    a.setInputCbs(onmidicb, onstatechangecb);
    a.setOutputCbs();

    return {
        type: "SET_ACCESS",
        payload: a as MIDIController | unknown,
    };
};

export const determineDeviceControl = (using: {
    usingFader: boolean;
    usingKnob: boolean;
}): IDetermineDeviceControlAction => {
    return {
        type: "DETERMINE_DEVICE_CONTROL",
        payload: using,
    };
};
