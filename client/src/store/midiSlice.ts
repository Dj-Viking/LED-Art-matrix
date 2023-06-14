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
import { MIDIInputName } from "../constants";

export type MIDISliceState = IAccessRecordState;

export const defaultMappingEditOptions = {
    uiName: "" as any,
};

export const initialMidiSliceState: MIDISliceState = {
    controllerInUse: "XONE:K2 MIDI",
    // TODO: could be custom set - Will fetch from local storage and/or user preferences set in their db
    midiMappingInUse: {
        // TODO: keep track of which controller name was recently used
        hasPreference: false,
        recentlyUsed: "XONE:K2 MIDI",
        mapping: {},
    },
    midiEditMode: false,
    isListeningForMappingEdit: false,
    mappingEditOptions: defaultMappingEditOptions,
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
        setMappingEditOptions: (
            state: MIDISliceState,
            action: PayloadAction<Partial<MIDISliceState["mappingEditOptions"]>>
        ) => {
            return produce(state, () => {
                state.mappingEditOptions = {
                    ...state.mappingEditOptions,
                    ...action.payload,
                };
            });
        },
        setListeningForMappingEdit: (state: MIDISliceState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.isListeningForMappingEdit = action.payload;
            });
        },
        setHasPreferencesSet: (state: MIDISliceState, action: PayloadAction<boolean>) => {
            return produce(state, () => {
                state.midiMappingInUse.hasPreference = action.payload;
            });
        },
        setControllerInUse: (
            state: MIDISliceState,
            action: PayloadAction<{
                controllerName: MIDIInputName;
                hasPreference: boolean;
            }>
        ) => {
            return produce(state, () => {
                const { controllerName, hasPreference } = action.payload;
                state.controllerInUse = controllerName;

                // TODO: redo this part to use the new midi mapping class object structure

                // const { uiMappings, channelMappings } =
                //     MIDIController.getMIDIControllerUIandChannelMappings(
                //         controllerName,
                //         hasPreference
                //     );

                // state.midiMappingInUse.channelMappings = deepCopy(channelMappings);
                // state.midiMappingInUse.uiMappings = deepCopy(uiMappings);
            });
        },
        // TODO: make an action for updating a specific control mapping to the controller in use
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
                console.log("what is inited in state for mappings", action.payload);
                // state.midiMappingInUse = action.payload.midiMappingInUse;
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
