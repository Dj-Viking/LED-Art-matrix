import { createAsyncThunk } from "@reduxjs/toolkit";
import { KeyInputName } from "../../utils/KeyMappingClass";

import { MyThunkConfig } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { KeyMappingClass } from "../../utils/KeyMappingClass";
import { keyboardActions } from "../keyboardSlice";
import { UNIMPLEMENTED } from "./midiActionCreators";

function DEBUG_KEYBOARD_ACTION(
    uiName: string,
    name: KeyInputName,
    controlName: string,
    channel: number,
    signal: "keyDown"
): void {
    console.warn(
        "[DEBUG KEYBOARD ACTION]:\n",
        "uiname",
        uiName,
        "\n",
        "key input name",
        name,
        "\n",
        "control name",
        controlName,
        "\n",
        "channel",
        channel,
        "\n",
        "signal",
        signal,
        "\n"
    );
}
