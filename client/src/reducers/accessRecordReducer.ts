import { IAccessRecordState, IAccessRecordAction } from "../types";
import { MIDIInput, MIDIOutput } from "../utils/MIDIControlClass";


const accessRecordReducer = (
  state: IAccessRecordState = {
    inputs: [] as Array<MIDIInput>,
    outputs: [] as Array<MIDIOutput>,
    online: false,
    onstatechange: null,
    sysexEnabled: false
  }, 
  action: IAccessRecordAction
): IAccessRecordState => {
  switch (action.type) {
    case "SET_ACCESS": 
      return {
        ...state,
        ...action.payload
      };
    default: return state;
  }
};

export default accessRecordReducer;