import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIInputName, SUPPORTED_CONTROLLERS } from "../../constants";

import { MyThunkConfig } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { MIDIController, MIDIMessageEvent, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { MIDIMappingPreference } from "../../utils/MIDIMappingClass";
import { midiActions } from "../midiSlice";

export function UNIMPLEMENTED(name: MIDIInputName, event: MIDIMessageEvent, channel: number): void {
    console.log("UNIMPLEMENTED CONTROLLER receiving MESSAGES", name, "\n", event, "\n channel", channel);
}

function DEBUGMIDIMESSAGE(
    uiName: string,
    name: MIDIInputName,
    controlName: string,
    channel: number,
    midiIntensity: number
): void {
    console.log(
        "uiname",
        uiName,
        "\n midi input name",
        name,
        "\n controlName",
        controlName,
        "\n channel ",
        channel,
        "\n intensity",
        midiIntensity
    );
}

export const buildMIDIAccessGetter = createAsyncThunk<MIDIController, void, MyThunkConfig>(
    "midiSlice/midiAccess",
    async (_params, _thunkAPI) => {
        const browserAccess = await MIDIController.requestMIDIAccess();

        const mc = new MIDIController(browserAccess, _thunkAPI.dispatch);

        const midicb = function (midi_event: MIDIMessageEvent): void {
            const isEditMode = _thunkAPI.getState().midiState.midiEditMode;
            const isListeningForMappingEdit = _thunkAPI.getState().midiState.isListeningForMappingEdit;
            const buttonIds = _thunkAPI.getState().presetButtonsListState.presetButtons.map((btn) => btn.id);
            const hasPref = _thunkAPI.getState().midiState.midiMappingInUse.hasPreference;
            const name = MIDIController.stripNativeLabelFromMIDIInputName(midi_event.currentTarget.name);
            const uiName = _thunkAPI.getState().midiState.mappingEditOptions.uiName;
            const channel = midi_event.data[1];
            const midiIntensity = midi_event.data[2];

            // will get updated if we are in edit mode and listening for changes
            // only make a new one if it's not currently set in state yet
            let pref: MIDIMappingPreference<typeof name>;

            // set channel and intensity and controller in use
            _thunkAPI.dispatch(midiActions.setChannel(channel));
            _thunkAPI.dispatch(midiActions.setIntensity(midiIntensity));

            const controlName: string = SUPPORTED_CONTROLLERS[name][channel];

            _thunkAPI.dispatch(
                midiActions.setControllerInUse({
                    controllerName: name,
                    hasPreference: hasPref,
                })
            );

            if (
                Object.keys(_thunkAPI?.getState()?.midiState?.midiMappingInUse?.midiMappingPreference?.[name])
                    ?.length === 0
            ) {
                pref = new MIDIMappingPreference(name, _thunkAPI.dispatch);
            } else {
                pref = deepCopy(new MIDIMappingPreference(name, _thunkAPI.dispatch));

                pref.mapping = _thunkAPI.getState().midiState.midiMappingInUse.midiMappingPreference[name];

                MIDIMappingPreference.setMIDICallbackMapBasedOnControllerName(pref, _thunkAPI.dispatch);
            }

            DEBUGMIDIMESSAGE(uiName, name, controlName, channel, midiIntensity);

            if (isEditMode && isListeningForMappingEdit) {
                _thunkAPI.dispatch(midiActions.setListeningForMappingEdit(false));

                console.log("setting the new control mapping", name, controlName, channel, uiName);

                MIDIController.mapMIDIChannelToInterface(name, controlName, channel, uiName, _thunkAPI.dispatch);

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
            MIDIController.handleMIDIMessage(midi_event, _thunkAPI.dispatch, pref, name, buttonIds);
        };
        const onstatechangecb = (event: MIDIConnectionEvent): void => {
            console.log("input had a change event", event);
        };
        // browserAccess.onstatechange = (event: MIDIConnectionEvent) => {
        //     console.log("browser access reference got a state change", event);
        // };

        // make sure both the callback map and the mapping are applied to the midicontroller class separately
        // since I don't think I can store a class instance into the redux state (i dont think T_T) nope!

        mc.setInputCbs(midicb, onstatechangecb);

        // no use for setting output midi controller callbacks (yet)

        console.log("what is mc here on initialization of midi control", mc);
        return mc;
    }
);
