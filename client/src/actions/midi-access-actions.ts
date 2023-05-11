import {
    SetAccessRecordAction,
    IDetermineDeviceControlAction,
    SetMIDIEditModeAction,
} from "../types";

export const setMIDIEditMode: SetMIDIEditModeAction = (mode) => {
    return {
        type: "SET_MIDI_EDIT_MODE",
        payload: mode,
    };
};

export const setAccess: SetAccessRecordAction = (access, onmidicb, onstatechangecb) => {
    if (access) {
        if (!access.inputs?.length) {
            return {
                type: "SET_ACCESS",
                // as any because whatever - typescript is too strict with my types right now
                // I dont have a good type inference system set up yet
                payload: access as any,
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
    }
    return {
        type: "SET_ACCESS",
        payload: null,
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
