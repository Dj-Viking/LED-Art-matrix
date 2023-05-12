import { createSlice, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccessRecordState } from "../types";
import { Draft, produce } from "immer";
import {
    MIDIAccessRecord,
    MIDIInput,
    MIDIOutput,
    MIDIConnectionEvent,
} from "../utils/MIDIControlClass";
import { newReducer } from "../utils/addReducer";
import { buildMIDIAccessGetter } from "../actions/midiActionCreators";

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
            produce((draft: Draft<MIDISliceState>, action: PayloadAction<MIDIAccessRecord>) => {
                //
                const { inputs, outputs, sysexEnabled, onstatechange } = action.payload;

                console.log("got some access stuff", inputs, outputs, sysexEnabled, onstatechange);
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
