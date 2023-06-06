import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIInputName, SUPPORTED_CONTROLLERS } from "../../constants";

import { MyThunkConfig } from "../../types";
import {
    MIDIController,
    MIDIMessageEvent,
    MIDIConnectionEvent,
} from "../../utils/MIDIControlClass";
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

        const midicb = function (midi_event: MIDIMessageEvent): void {
            const isEditMode = _thunkAPI.getState().midiState.midiEditMode;
            const isListeningForMappingEdit =
                _thunkAPI.getState().midiState.isListeningForMappingEdit;

            const _buttonIds = _thunkAPI
                .getState()
                .presetButtonsListState.presetButtons.map((btn) => btn.id);

            if (isEditMode && isListeningForMappingEdit) {
                //
                _thunkAPI.dispatch(midiActions.setListeningForMappingEdit(false));

                const name = MIDIController.stripNativeLabelFromMIDIInputName(
                    midi_event.currentTarget.name
                );

                const uiName = _thunkAPI.getState().midiState.mappingEditOptions.uiName;

                const channel = midi_event.data[1];

                const controlName = SUPPORTED_CONTROLLERS[name][channel];
                console.log("setting the new control mapping", name, controlName, channel, uiName);

                MIDIController.mapMIDIChannelToInterface(name, controlName, channel, uiName);
            }

            switch (true) {
                case midi_event.currentTarget.name.includes("TouchOSC Bridge"):
                    MIDIController.handleTouchOSCMessage(midi_event, _thunkAPI.dispatch);
                    break;
                // the browser appends some number and a dash for whatever reason
                case midi_event.currentTarget.name.includes("XONE"):
                    MIDIController.handleXONEK2MIDIMessage(
                        midi_event,
                        _thunkAPI.dispatch,
                        _buttonIds
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
        const mc = new MIDIController(browserAccess);
        mc.setInputCbs(midicb, onstatechangecb);
        return mc;
    }
);
