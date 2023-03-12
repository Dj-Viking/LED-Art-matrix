import { IAccessRecordState, IAccessRecordAction } from "../types";
import {
    MIDIAccessRecord,
    MIDIConnectionEvent,
    MIDIInput,
    MIDIOutput,
} from "../utils/MIDIControlClass";

const accessRecordReducer = (
    state: IAccessRecordState = {
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
        case "DETERMINE_DEVICE_CONTROL": {
            return {
                ...state,
                ...action.payload,
            };
        }
        case "SET_ACCESS":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default accessRecordReducer;
