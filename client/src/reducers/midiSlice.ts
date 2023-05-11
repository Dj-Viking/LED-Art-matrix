import { createSlice, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccessRecordState } from "../types";
import { produce } from "immer";
import {
    MIDIAccessRecord,
    MIDIInput,
    MIDIOutput,
    MIDIConnectionEvent,
} from "../utils/MIDIControlClass";

export type MIDISliceState = IAccessRecordState;

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

export const midiSlice = createSlice({
    name: "midiSlice",
    initialState,
    reducers: {
        setOnline: (state: MIDISliceState, action: PayloadAction<boolean>) => {
            produce(state, (draft) => {
                const onlineStatebefore = selectMIDIOnlineState(state);
                console.log("online state before", onlineStatebefore);
                draft.online = action.payload;

                const onlineStateafter = selectMIDIOnlineState(state);
                console.log("online state after", onlineStateafter);
            });
        },
    },
});

export const midiActions = {
    ...midiSlice.actions,
};

export const midiSliceState = (state: MIDISliceState): MIDISliceState => state;

export const selectMIDIOnlineState = createDraftSafeSelector(
    midiSliceState,
    (state: MIDISliceState) => state.online
);
