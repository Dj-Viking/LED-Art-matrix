import { SetAccessRecordAction, IDetermineDeviceControlAction } from "../types";
import { MIDIController } from "../utils/MIDIControlClass";

export const setAccess: SetAccessRecordAction = (access, onmidicb, onstatechangecb) => {
    if (!access.inputs?.length) {
        return {
            type: "SET_ACCESS",
            // as any because whatever - typescript is too strict with my types right now
            // I dont have a good type inference system set up yet
            payload: { ...new MIDIController(access.getAccess()) } as any,
        };
    } else {
        const a = access;
        a.setInputCbs(onmidicb, onstatechangecb);
        a.setOutputCbs();

        return {
            type: "SET_ACCESS",
            payload: a,
        };
    }
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
