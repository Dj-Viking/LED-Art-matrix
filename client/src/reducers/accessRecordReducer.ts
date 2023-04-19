import {
    IAccessRecordState,
    IAccessRecordAction,
    ISetMIDIEditModeAction,
    IDetermineDeviceControlAction,
    ISetAccessRecordAction,
} from "../types";
import {
    MIDIAccessRecord,
    MIDIConnectionEvent,
    MIDIInput,
    MIDIOutput,
} from "../utils/MIDIControlClass";

const accessRecordReducer = (
    state: IAccessRecordState = {
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
            onstatechange: (_event: MIDIConnectionEvent) => void 0,
        } as MIDIAccessRecord,
        onstatechange: (_event: MIDIConnectionEvent) => void 0,
        sysexEnabled: false,
    },
    action: IAccessRecordAction
): IAccessRecordState => {
    switch (action.type) {
        case "SET_MIDI_EDIT_MODE": {
            const payload = action.payload as ISetMIDIEditModeAction["payload"];
            return {
                ...state,
                midiEditMode: payload,
            };
        }
        case "DETERMINE_DEVICE_CONTROL": {
            const payload = action.payload as IDetermineDeviceControlAction["payload"];
            return {
                ...state,
                ...payload,
            };
        }
        case "SET_ACCESS": {
            const payload = action.payload as ISetAccessRecordAction["payload"];
            return {
                ...state,
                ...payload,
            };
        }
        default:
            return state;
    }
};

export default accessRecordReducer;
