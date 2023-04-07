export const IS_PROD = process.env.NODE_ENV === "production";
export const API_URL = IS_PROD ? "https://led-matrices.onrender.com" : "http://localhost:3001";
export const LOCATION_DISPLAY_ID = "location-display";
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

export type XONEK2_ControlNames =
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
    | "4_fader"
    | "1_b_button"
    | "1_a_button"
    | "1_c_button"
    | "1_d_button"
    | "2_e_button"
    | "2_f_button"
    | "2_g_button"
    | "2_h_button"
    | "3_i_button"
    | "3_j_button"
    | "3_k_button"
    | "3_l_button"
    | "4_m_button"
    | "4_n_button"
    | "4_o_button"
    | "4_p_button";

export type XONEK2_MIDIChannelTable = Record<number, XONEK2_ControlNames>;

export const XONEK2_MIDI_CHANNEL_TABLE: XONEK2_MIDIChannelTable = {
    4: "1_upper_knob",
    8: "1_middle_knob",
    12: "1_lower_knob",
    16: "1_fader",
    36: "1_a_button",
    37: "1_b_button",
    38: "1_c_button",
    39: "1_d_button",
    5: "2_upper_knob",
    9: "2_middle_knob",
    13: "2_lower_knob",
    17: "2_fader",
    32: "2_e_button",
    33: "2_f_button",
    34: "2_g_button",
    35: "2_h_button",
    18: "3_fader",
    28: "3_i_button",
    29: "3_j_button",
    30: "3_k_button",
    31: "3_l_button",
    19: "4_fader",
    24: "4_m_button",
    25: "4_n_button",
    26: "4_o_button",
    27: "4_p_button",
};
export type nanoKontrol2ControlNames = "something" | "else" | "not implemented yet";
export type nanoKontrol2_MIDIChannelTable = Record<number, nanoKontrol2ControlNames>;
export const nanoKontrol2_MIDI_CHANNEL_TABLE: nanoKontrol2_MIDIChannelTable = {
    1: "something",
    2: "else",
    3: "not implemented yet",
};

export const ULTRALITE_MK3_HYBRID_SYNC_PORT = {
    /** UNIMPLEMENTED */
};
export const ULTRALITE_MK3_HYBRID_MIDI_PORT = {
    /** UNIMPLEMENTED */
};

type Nullable<T> = null | T;
export type ControllerName =
    | "Not Found"
    | "UltraLite mk3 Hybrid"
    | "XONE:K2 MIDI"
    | "nanoKontrol2"
    | "UltraLite mk3 Hybrid MIDI Port"
    | "UltraLite mk3 Hybrid Sync Port";
export type MIDIInputName = string & keyof ControllerLookup<ControllerName>;
export type ControllerLookup<Name extends ControllerName> = Record<
    Name,
    Name extends "XONE:K2 MIDI" //--------------// if
        ? Nullable<XONEK2_MIDIChannelTable> //--// then
        : Name extends "nanoKontrol2" //--------// else if
        ? nanoKontrol2_MIDIChannelTable //------// then
        : Nullable<Record<number, string>> //---// else
>;

export const SUPPORTED_CONTROLLERS: ControllerLookup<ControllerName> = {
    "Not Found": null,
    "XONE:K2 MIDI": XONEK2_MIDI_CHANNEL_TABLE,
    "UltraLite mk3 Hybrid": null,
    nanoKontrol2: nanoKontrol2_MIDI_CHANNEL_TABLE,
    "UltraLite mk3 Hybrid Sync Port": ULTRALITE_MK3_HYBRID_SYNC_PORT,
    "UltraLite mk3 Hybrid MIDI Port": ULTRALITE_MK3_HYBRID_MIDI_PORT,
};
