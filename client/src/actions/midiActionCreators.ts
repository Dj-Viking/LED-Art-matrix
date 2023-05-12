import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIController, MIDIMessageEvent, MIDIConnectionEvent } from "../utils/MIDIControlClass";
import { ToolkitDispatch, ToolkitRootState } from "../store/store";

export const buildMIDIAccessGetter = createAsyncThunk<
    MIDIController,
    void,
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>("midiSlice/midiAccess", async (_params, _thunkAPI) => {
    const browserAccess = await MIDIController.requestMIDIAccess();

    const midicb = function (midi_event: MIDIMessageEvent): void {
        const isEditMode = _thunkAPI.getState().midiState.midiEditMode;

        const _buttonIds = _thunkAPI
            .getState()
            .presetButtonsListState.presetButtons.map((btn) => btn.id);

        if (isEditMode) {
            MIDIController.mapMIDIChannelToInterface(midi_event);
        }
        if (midi_event.currentTarget.name.includes("XONE:K2")) {
            MIDIController.handleXONEK2MIDIMessage(midi_event, _thunkAPI.dispatch, _buttonIds);
        } else {
            console.log(
                "UNIMPLEMENTED CONTROLLER receiving MESSAGES",
                midi_event.currentTarget.name,
                "\n",
                midi_event
            );
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
});
