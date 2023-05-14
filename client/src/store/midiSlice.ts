import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccessRecordState } from "../types";
import { produce } from "immer";
import {
    MIDIAccessRecord,
    MIDIInput,
    MIDIOutput,
    MIDIConnectionEvent,
    MIDIController,
} from "../utils/MIDIControlClass";
import { newReducer } from "../utils/newReducer";
import { buildMIDIAccessGetter } from "./actions/midiActionCreators";

export type MIDISliceState = IAccessRecordState;

const initialState: MIDISliceState = {
    midiEditMode: false,
    usingFader: false,
    usingKnob: false,
    intensity: 0,
    channel: 0,
    inputs: [] as Array<MIDIInput>,
    outputs: [] as Array<MIDIOutput>,
    online: false,
    access: {
        inputs: new Map<string, any>(),
        outputs: new Map<string, any>(),
        sysexEnabled: false,
        onstatechange: (_event: MIDIConnectionEvent) => void 0,
    } as MIDIAccessRecord,
};

const getMIDIAccess = buildMIDIAccessGetter;

export const midiSlice = createSlice({
    name: "midiSlice",
    initialState,
    reducers: {
        determineDeviceControl: (
            state: MIDISliceState,
            action: PayloadAction<{ usingFader: boolean; usingKnob: boolean }>
        ) => {
            return produce(state, () => {
                state.usingFader = action.payload.usingFader;
                state.usingKnob = action.payload.usingKnob;
            });
        },
        setChannel: (state: MIDISliceState, action: PayloadAction<number>) => {
            return produce(state, () => {
                state.channel = action.payload;
            });
        },
        setIntensity: (state: MIDISliceState, action: PayloadAction<number>) => {
            return produce(state, () => {
                state.intensity = action.payload;
            });
        },
        toggleMidiEditMode: (state: MIDISliceState) => {
            return produce(state, () => {
                state.midiEditMode = !state.midiEditMode;
            });
        },
    },
    extraReducers: (builder) => {
        // set midi state after access is given by the browser
        newReducer(builder, getMIDIAccess.fulfilled, (state, action) => {
            return produce(state, () => {
                // Map interface is not serializable in redux toolkit for whatever reason
                // but i can still put it into state
                state.access = action.payload.access;
                state.inputs = action.payload.inputs;
                state.outputs = action.payload.outputs;
                state.online = true;
            });
        });

        newReducer(builder, getMIDIAccess.pending, (state) => {
            state.online = false;
        });
    },
});

export const midiActions = {
    ...midiSlice.actions,
    getMIDIAccess,
};
