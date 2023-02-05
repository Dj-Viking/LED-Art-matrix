export const IS_PROD = process.env.NODE_ENV === "production";
export const API_URL = IS_PROD ? "https://led-matrices.herokuapp.com" : "http://localhost:3001";
export const RAINBOW_TEST_ANIMATION = `
@keyframes rainbowTest {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const RAINBOW_V2_ANIMATION = `
@keyframes v2 {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: orange;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const WAVES_ANIMATION = `
@keyframes waves {
  0.001% {
    background-color: red;
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const SPIRAL_ANIMATION = `
@keyframes spiral {
  0.001% {
    background-color: blue;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: red;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: white;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}
`;
export const FOUR_SPIRALS_ANIMATION = `
@keyframes fourSpirals {
  0.001% {
    background-color: red;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: #ff6400;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: blue;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: #ff00c8;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;
export const DM5_ANIMATION = `
@keyframes dm5 {
  0.001% {
    background-color: lime;
    /* left: 0px; top: 0px; */
    /* border-radius: 0 0 0 0; */
  }
  25% {
    background-color: black;
    /* left: 30px;
            top: 0px; */
    /* border-radius: 50% 0 0 0 */
  }
  50% {
    background-color: lime;
    /* left: 30px;
            top: 30px; */
    /* border-radius: 50% 50% 0 0 */
  }
  75% {
    background-color: black;
    /* left: 0px;
            top: 30px; */
    /* border-radius: 50% 0 50% 50% */
  }
  100% {
    background-color: lime;
    /* left: 0px;
            top: 0px; */
    /* border-radius: 50% 50% 50% 50% */
  }
}`;

export type MyIndexToKeyMap = Record<number, string>;
export const MY_INDEX_TO_KEY_MAP = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "q",
    6: "w",
    7: "e",
    8: "r",
    9: "a",
    10: "s",
    11: "d",
    12: "f",
} as MyIndexToKeyMap;
export const LOCATION_DISPLAY_ID = "location-display";

export type TABLE_VALUES =
    | "1_upper_knob"
    | "1_upper_button"
    | "1_middle_button"
    | "1_lower_button"
    | "1_middle_knob"
    | "1_lower_knob"
    | "2_upper_knob"
    | "2_middle_knob"
    | "2_lower_knob"
    | "1_fader"
    | "2_fader"
    | "3_fader"
    | "4_fader";

export type ControllerName =
    | "Not Found"
    | "UltraLite mk3 Hybrid"
    | "XONE:K2 MIDI"
    | "UltraLite mk3 Hybrid MIDI Port"
    | "UltraLite mk3 Hybrid Sync Port";

export type MIDIInputName = string & keyof ControllerLookup;
export type ControllerMIDIChannelTable = Record<number, TABLE_VALUES>;

export const XONEK2_MIDI_CHANNEL_TABLE = {
    4: "1_upper_knob",
    8: "1_middle_knob",
    12: "1_lower_knob",
    5: "2_upper_knob",
    9: "2_middle_knob",
    13: "2_lower_knob",
    16: "1_fader",
    17: "2_fader",
    18: "3_fader",
    19: "4_fader",
} as ControllerMIDIChannelTable;

export const ULTRALITE_MK3_HYBRID_SYNC_PORT = {
    4: "1_upper_knob",
    8: "1_middle_knob",
    12: "1_lower_knob",
    5: "2_upper_knob",
    9: "2_middle_knob",
    13: "2_lower_knob",
    16: "1_fader",
    17: "2_fader",
    18: "3_fader",
    19: "4_fader",
} as ControllerMIDIChannelTable;
export const ULTRALITE_MK3_HYBRID_MIDI_PORT = {
    4: "1_upper_knob",
    8: "1_middle_knob",
    12: "1_lower_knob",
    5: "2_upper_knob",
    9: "2_middle_knob",
    13: "2_lower_knob",
    16: "1_fader",
    17: "2_fader",
    18: "3_fader",
    19: "4_fader",
} as ControllerMIDIChannelTable;

type Nullable<T> = null | T;

export type ControllerLookup = Record<ControllerName, Nullable<ControllerMIDIChannelTable>>;

export const SUPPORTED_CONTROLLERS: ControllerLookup = {
    "Not Found": null,
    "XONE:K2 MIDI": XONEK2_MIDI_CHANNEL_TABLE,
    "UltraLite mk3 Hybrid": null,
    "UltraLite mk3 Hybrid Sync Port": ULTRALITE_MK3_HYBRID_SYNC_PORT,
    "UltraLite mk3 Hybrid MIDI Port": ULTRALITE_MK3_HYBRID_MIDI_PORT,
};
