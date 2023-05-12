import { createAsyncThunk } from "@reduxjs/toolkit";
import { MIDIAccessRecord, MIDIController } from "../utils/MIDIControlClass";
import { ToolkitDispatch, ToolkitRootState } from "../reducers/store";

export const buildMIDIAccessGetter = createAsyncThunk<
    MIDIAccessRecord,
    void,
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>("midiSlice/midiAccess", async (_params, _thunkAPI) => {
    return await MIDIController.requestMIDIAccess();
});
