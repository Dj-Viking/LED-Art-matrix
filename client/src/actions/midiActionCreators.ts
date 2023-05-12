import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIController } from "../utils/MIDIControlClass";
import { ToolkitDispatch, ToolkitRootState } from "../reducers/store";

export const buildMIDIAccessGetter = createAsyncThunk<
    MIDIController,
    void,
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>("midiSlice/midiAccess", async (_params, _thunkAPI) => {
    const browserAccess = await MIDIController.requestMIDIAccess();
    return new MIDIController(browserAccess);
});
