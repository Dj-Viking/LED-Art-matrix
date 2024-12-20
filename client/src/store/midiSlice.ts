/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MIDIInputName } from "../constants";
import { deepCopy } from "../utils/deepCopy";
import { CallbackMapping } from "../utils/MIDIMappingClass";

export type MIDISliceState = IAccessRecordState;

export const defaultMappingEditOptions = {
    uiName: "" as any,
};

export const initialMidiSliceState: MIDISliceState = {
    selectedController: "XONE:K2 MIDI",
    isTesting: process.env.NODE_ENV === "test",
    usingMidi: process.env.NODE_ENV === "test",
    controllerInUse: "XONE:K2 MIDI",
    // TODO: could be custom set - Will fetch from local storage and/or user preferences set in their db
    midiMappingInUse: {
        // TODO: keep track of which controller name was recently used
        hasPreference: false,
        recentlyUsed: "XONE:K2 MIDI",
        callbackMap: {} as any,
        midiMappingPreference: {
            "Not Found": {} as any,
            "TouchOSC Bridge": {} as any,
            "XONE:K2 MIDI": {} as any,
        } as Partial<IAccessRecordState["midiMappingInUse"]["midiMappingPreference"]> as any,
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
        resetState: (state: MIDISliceState) => {
            return produce(state, () => {
                Object.assign(state, initialMidiSliceState);
            });
        },
        sortMIDIInputsByRecentlyused: (state: MIDISliceState) => {
            return produce(state, () => {
                const activeController = state.inputs.find(
                    (input) =>
                        input?.name === state.selectedController
                );

                state.inputs = state.inputs.splice(0, 0, activeController as any); 
            });
        },
        setSelectedController: (state: MIDISliceState, action: PayloadAction<MIDISliceState["selectedController"]>) => {
            return produce(state, () => {
                state.selectedController = MIDIController.stripNativeLabelFromMIDIInputName(action.payload);
            });
        },
        toggleUsingMidi: (state: MIDISliceState) => {
            return produce(state, () => {
                state.usingMidi = !state.usingMidi;
            });
        },
        setCallbackMap: (state: MIDISliceState, action: PayloadAction<CallbackMapping>) => {
            return produce(state, () => {
                state.midiMappingInUse.callbackMap = action.payload;
            });
        },
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

                const preference = MIDIController.getMIDIMappingPreferenceFromStorage(
                    controllerName,
                    hasPreference // NOT IMPLEMENTED YET
                );

                state.controllerInUse = controllerName;

                // so basically midiMappingPreference is mimicking the localstorage keyvalue store

                state.midiMappingInUse.midiMappingPreference[controllerName] = deepCopy(preference?.mapping || {});

                state.midiMappingInUse.recentlyUsed = controllerName;
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
                // if we're currently toggling edit mode off then stop listening for midi preference editing changes
                if (state.midiEditMode) {
                    state.isListeningForMappingEdit = false;
                }
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

                const controllerName = action.payload.controllerPreference.midiMappingPreference.name;

                state.midiMappingInUse.midiMappingPreference[controllerName] =
                    action.payload.controllerPreference.midiMappingPreference.mapping;

                state.midiMappingInUse.callbackMap =
                    action.payload.controllerPreference.midiMappingPreference.callbackMap;

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
