import { IAccessRecordState, IAccessRecordAction } from "../types";
import { MIDIAccessRecord, MIDIInput, MIDIOutput } from "../utils/MIDIControlClass";

const accessRecordReducer = (
    state: IAccessRecordState = {
        usingFader: false,
        usingKnob: false,
        inputs: [] as Array<MIDIInput>,
        outputs: [] as Array<MIDIOutput>,
        online: false,
        access: {} as MIDIAccessRecord,
        onstatechange: null,
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
