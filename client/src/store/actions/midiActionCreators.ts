import { createAsyncThunk } from "@reduxjs/toolkit";

import { MyThunkConfig } from "../../types";
import {
    MIDIController,
    MIDIMessageEvent,
    MIDIConnectionEvent,
} from "../../utils/MIDIControlClass";

export const buildMIDIAccessGetter = createAsyncThunk<MIDIController, void, MyThunkConfig>(
    "midiSlice/midiAccess",
    async (_params, _thunkAPI) => {
        const browserAccess = await MIDIController.requestMIDIAccess();

        const midicb = function (midi_event: MIDIMessageEvent): void {
            const isEditMode = _thunkAPI.getState().midiState.midiEditMode;

            const _buttonIds = _thunkAPI
                .getState()
                .presetButtonsListState.presetButtons.map((btn) => btn.id);

            if (isEditMode) {
                MIDIController.mapMIDIChannelToInterface(midi_event);
            }

            switch (true) {
                case midi_event.currentTarget.name.includes("TouchOSC Bridge"):
                    MIDIController.handleTouchOSCMessage(midi_event, _thunkAPI.dispatch);
                    break;
                case midi_event.currentTarget.name.includes("XONE"): // the browser appends some number and a dash for whatever reason
                    MIDIController.handleXONEK2MIDIMessage(
                        midi_event,
                        _thunkAPI.dispatch,
                        _buttonIds
                    );
                    break;
                default: {
                    const channel = midi_event.data[1];
                    console.log(
                        "UNIMPLEMENTED CONTROLLER receiving MESSAGES",
                        midi_event.currentTarget.name,
                        "\n",
                        midi_event,
                        "\n channel",
                        channel
                    );
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
