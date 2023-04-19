import {
    SetAccessRecordAction,
    IDetermineDeviceControlAction,
    SetMIDIEditModeAction,
    CollectGarbageAccessAction,
} from "../types";
import { MIDIAccessRecord, MIDIInput, MIDIOutput, MIDIController } from "../utils/MIDIControlClass";

export const collectGarbageAccess: CollectGarbageAccessAction = () => {
    return {
        type: "COLLECT_GARBAGE_ACCESS",
        payload: {
            midiEditMode: false,
            usingFader: false,
            usingKnob: false,
            inputs: [] as Array<MIDIInput>,
            outputs: [] as Array<MIDIOutput>,
            online: false,
            access: {
                inputs: new Map<string, any>(),
                outputs: new Map<string, any>(),
                sysexEnabled: false,
                onstatechange: () => void 0,
            } as MIDIAccessRecord,
            onstatechange: (_event) => void 0,
            sysexEnabled: false,
        },
    };
};

export const setMIDIEditMode: SetMIDIEditModeAction = (mode) => {
    return {
        type: "SET_MIDI_EDIT_MODE",
        payload: mode,
    };
};

export const setAccess: SetAccessRecordAction = (access, onmidicb, onstatechangecb) => {
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
