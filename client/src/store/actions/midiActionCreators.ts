import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIInputName, SUPPORTED_CONTROLLERS } from "../../constants";

import { MyThunkConfig } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import {
    MIDIController,
    MIDIMessageEvent,
    MIDIConnectionEvent,
} from "../../utils/MIDIControlClass";
import { MIDIMappingPreference } from "../../utils/MIDIMappingClass";
import { midiActions } from "../midiSlice";

function UNIMPLEMENTED(name: MIDIInputName, event: MIDIMessageEvent, channel: number): void {
    console.log(
        "UNIMPLEMENTED CONTROLLER receiving MESSAGES",
        name,
        "\n",
        event,
        "\n channel",
        channel
    );
}

export const buildMIDIAccessGetter = createAsyncThunk<MIDIController, void, MyThunkConfig>(
    "midiSlice/midiAccess",
    async (_params, _thunkAPI) => {
        const browserAccess = await MIDIController.requestMIDIAccess();

        const mc = new MIDIController(browserAccess, _thunkAPI.dispatch);

        const midicb = function (midi_event: MIDIMessageEvent): void {
            const isEditMode = _thunkAPI.getState().midiState.midiEditMode;
            const isListeningForMappingEdit =
                _thunkAPI.getState().midiState.isListeningForMappingEdit;

            const _buttonIds = _thunkAPI
                .getState()
                .presetButtonsListState.presetButtons.map((btn) => btn.id);

            const name = MIDIController.stripNativeLabelFromMIDIInputName(
                midi_event.currentTarget.name
            );

            // will get updated if we are in edit mode and listening for changes
            // only make a new one if it's not currently set in state yet
            let pref: MIDIMappingPreference<typeof name>;
            if (
                Object.keys(
                    _thunkAPI.getState().midiState.midiMappingInUse.midiMappingPreference[name]
                ).length === 0
            ) {
                pref = new MIDIMappingPreference(name, _thunkAPI.dispatch);
            } else {
                pref = deepCopy(new MIDIMappingPreference(name, _thunkAPI.dispatch));

                pref.mapping =
                    _thunkAPI.getState().midiState.midiMappingInUse.midiMappingPreference[name];

                MIDIMappingPreference.setMIDICallbackMapBasedOnControllerName(
                    name,
                    pref,
                    _thunkAPI.dispatch
                );
            }

            const uiName = _thunkAPI.getState().midiState.mappingEditOptions.uiName;

            const channel = midi_event.data[1];

            const controlName = SUPPORTED_CONTROLLERS[name][channel];

            if (isEditMode && isListeningForMappingEdit) {
                _thunkAPI.dispatch(midiActions.setListeningForMappingEdit(false));

                console.log("setting the new control mapping", name, controlName, channel, uiName);

                MIDIController.mapMIDIChannelToInterface(
                    name,
                    controlName,
                    channel,
                    uiName,
                    _thunkAPI.dispatch
                );

                // TODO: this only updates the preference mapping
                // calling the callback based on the channel number
                // should be handled separately
                // have to do this because typescript complains that I can't just set a class instance directly into the slice state
                pref = MIDIMappingPreference.updatePreferenceMapping(
                    pref,
                    name,
                    controlName,
                    channel,
                    uiName,
                    _thunkAPI.dispatch
                );
            }

            // TODO: call action to update midi state preference mappings

            switch (true) {
                case midi_event.currentTarget.name.includes("TouchOSC Bridge"):
                    // TODO: pass the preference class into here? and invoke the callback based on the ui name
                    // that was interacted with. see notes in midi control class on the data structure
                    MIDIController.handleTouchOSCMessage(
                        midi_event,
                        _thunkAPI.dispatch,
                        pref,
                        name
                    );
                    break;
                // the browser appends some number and a dash for whatever reason
                case midi_event.currentTarget.name.includes("XONE"):
                    MIDIController.handleXONEK2MIDIMessage(
                        midi_event,
                        _thunkAPI.dispatch,
                        _buttonIds,
                        pref,
                        name
                    );
                    break;
                default: {
                    const channel = midi_event.data[1];
                    UNIMPLEMENTED(midi_event.currentTarget.name, midi_event, channel);
                }
            }
        };
        const onstatechangecb = (event: MIDIConnectionEvent): void => {
            console.log("input had a change event", event);
        };
        // browserAccess.onstatechange = (event: MIDIConnectionEvent) => {
        //     console.log("browser access reference got a state change", event);
        // };

        // make sure both the callback map and the mapping are applied to the midicontroller class separately
        // since I don't think I can store a class instance into the redux state (i dont think T_T)

        mc.setInputCbs(midicb, onstatechangecb);

        console.log("what is mc here on initialization of midi control", mc);
        return mc;
    }
);
