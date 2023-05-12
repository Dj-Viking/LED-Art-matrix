import { createSlice, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccessRecordState } from "../types";
import { Draft, produce } from "immer";
import {
    MIDIAccessRecord,
    MIDIInput,
    MIDIOutput,
    MIDIConnectionEvent,
    MIDIController,
} from "../utils/MIDIControlClass";
import { newReducer } from "../utils/newReducer";
import { buildMIDIAccessGetter } from "../actions/midiActionCreators";

export type MIDISliceState = IAccessRecordState;

// const midicb = function (midi_event: MIDIMessageEvent): void {
//     console.log("midi edit mode", _midiEditMode);
//     if (_midiEditMode) {
//         return MIDIController.mapMIDIChannelToController(midi_event);
//     }
//     if (midi_event.currentTarget.name.includes("XONE:K2")) {
//         return MIDIController.handleXONEK2MIDIMessage(
//             midi_event,
//             _setChannel,
//             _setIntensity,
//             dispatchcb,
//             timeoutRef,
//             _buttonIds
//         );
//     }
// };

const onstatechangecb = function (_connection_event: MIDIConnectionEvent): void {
    // console.log("CONNECTION EVENT SET INPUT CB CALLBACK", _connection_event);
};

const initialState: MIDISliceState = {
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
};

const getMIDIAccess = buildMIDIAccessGetter;

export const midiSlice = createSlice({
    name: "midiSlice",
    initialState,
    reducers: {
        setOnline: (state: MIDISliceState, action: PayloadAction<boolean>) => {
            return produce(state, (draft) => {
                const onlineStatebefore = selectMIDIOnlineState(state);
                console.log("online state before", onlineStatebefore);
                draft.online = action.payload;

                const onlineStateafter = selectMIDIOnlineState(state);
                console.log("online state after", onlineStateafter);
            });
        },
    },
    extraReducers(builder) {
        // set midi state after access is given by the browser
        newReducer(
            builder,
            getMIDIAccess.fulfilled,
            produce((draft: Draft<MIDISliceState>, action: PayloadAction<MIDIController>) => {
                //
                console.log(new Date(), "made a midi controller in the thunk", action.payload);
                const mc = action.payload;
                draft.access = action.payload.access;
                draft.inputs = action.payload.inputs;

                draft.outputs = action.payload.outputs;
            })
        );

        newReducer(
            builder,
            getMIDIAccess.pending,
            produce((draft: Draft<MIDISliceState>, action: PayloadAction<MIDIController>) => {
                //
                console.log(new Date(), "requesting access");
            })
        );
    },
});

export const midiActions = {
    ...midiSlice.actions,
    getMIDIAccess,
};

export const midiSliceState = (state: MIDISliceState): MIDISliceState => state;

export const selectMIDIOnlineState = createDraftSafeSelector(
    midiSliceState,
    (state: MIDISliceState) => state.online
);
