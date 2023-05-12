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
import { deepCopy } from "../utils/deepCopy";

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
            const newState = Object.assign({}, state, deepCopy(state), { ...payload });
            return newState;
        }
        case "SET_ACCESS": {
            if (action.payload === null) return state;
            const payload = action.payload as ISetAccessRecordAction["payload"];
            const newState = Object.assign(state, deepCopy(state), { ...payload });
            return newState;
        }
        default:
            return state;
    }
};

export default accessRecordReducer;
