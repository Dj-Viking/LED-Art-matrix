import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAccessRecordState } from "../types";
import { produce } from "immer";
import {
    MIDIAccessRecord,
    MIDIInput,
    MIDIOutput,
    MIDIConnectionEvent,
} from "../utils/MIDIControlClass";
import { newReducer } from "../utils/newReducer";
import { buildMIDIAccessGetter } from "./actions/midiActionCreators";
import {
    ControllerName,
    DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING,
    DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING,
    SUPPORTED_CONTROLLERS,
} from "../constants";
import { deepCopy } from "../utils/deepCopy";

export type MIDISliceState = IAccessRecordState;

export const initialMidiSliceState: MIDISliceState = {
    controllerInUse: "XONE:K2 MIDI",
    midiMappingInUse: {
        channelMappings: deepCopy(DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING),
        uiMappings: deepCopy(DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING),
    }, // could be custom set - probably have to fetch from local storage and/or user preferences set in their db
    midiMappings: deepCopy(SUPPORTED_CONTROLLERS),
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
    initialState: initialMidiSliceState,
    reducers: {
        setControllerInUse: (state: MIDISliceState, action: PayloadAction<ControllerName>) => {
            return produce(state, () => {
                state.controllerInUse = action.payload;

                // TODO: when setting to different controller
                // will have to change both parts to reflect what is currently mapped
                // and custom set by the user/localStorage - if no custom settings set by the user/localStorage
                // then set the default mappings
            });
        },
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
