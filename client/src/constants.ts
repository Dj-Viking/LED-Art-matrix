import { IArtScrollerState, ILedState } from "./types";

export const IS_PROD = process.env.NODE_ENV === "production";
export const API_URL = IS_PROD ? "https://led-matrices.onrender.com" : "http://localhost:3001";
export const LOCATION_DISPLAY_ID = "location-display";
export const LED_AMOUNT = 32;

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
    40: "1_lower_button",
    44: "1_middle_button",
    48: "1_upper_button",
};

export type PresetButtonName =
    | "button_1_position"
    | "button_2_position"
    | "button_3_position"
    | "button_4_position"
    | "button_5_position"
    | "resetTimerButton";

export const DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING: Record<XONEK2_ControlNames, number> = {
    "1_upper_knob": 4,
    "1_middle_knob": 8,
    "1_lower_knob": 12,
    "1_fader": 16,
    "1_a_button": 36,
    "1_b_button": 37,
    "1_c_button": 38,
    "1_d_button": 39,
    "2_upper_knob": 5,
    "2_middle_knob": 9,
    "2_lower_knob": 13,
    "2_fader": 17,
    "2_e_button": 32,
    "2_f_button": 33,
    "2_g_button": 34,
    "2_h_button": 35,
    "3_fader": 18,
    "3_i_button": 28,
    "3_j_button": 29,
    "3_k_button": 30,
    "3_l_button": 31,
    "4_fader": 19,
    "4_m_button": 24,
    "4_n_button": 25,
    "4_o_button": 26,
    "4_p_button": 27,
    "1_lower_button": 40,
    "1_middle_button": 44,
    "1_upper_button": 48,
};

export type UIInterfaceDeviceName =
    | keyof ILedState
    | keyof IArtScrollerState["slider"]
    | PresetButtonName;

export const DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING: Record<
    UIInterfaceDeviceName,
    XONEK2_ControlNames
> = {
    button_1_position: "1_a_button",
    button_2_position: "1_b_button",
    button_3_position: "1_c_button",
    button_4_position: "1_d_button",
    button_5_position: "2_e_button",
    circleWidth: "1_upper_knob",
    vertPos: "1_middle_knob",
    hPos: "1_lower_knob",
    invert: "2_upper_knob",
    animDuration: "2_middle_knob",
    resetTimerButton: "1_lower_button",
    animVarCoeff: "1_fader",
    /**
     * never implemented
     */
    resetTimerFn: void 0 as never,
    /**
     * not yet implemented
     */
    isHSL: "" as any,
    /**
     * never implemented
     */
    presetName: void 0 as never,
};

export type nanoKontrol2ControlNames = "something" | "else" | "not implemented yet";

export type nanoKontrol2_MIDIChannelTable = Record<number, nanoKontrol2ControlNames>;

export const nanoKontrol2_MIDI_CHANNEL_TABLE: nanoKontrol2_MIDIChannelTable = {
    1: "something",
    2: "else",
    3: "not implemented yet",
};

export type TouchOscBridgeControlNames =
    | "fader_1"
    | "fader_2"
    | "fader_3"
    | "fader_4"
    | "button_1"
    | "button_2"
    | "button_3"
    | "button_4"
    | "top_fader";

export type TouchOscBridgeControlChannelTable = Record<number, TouchOscBridgeControlNames>;

// Simple touch osc layout channel table
export const touchOsc_MIDI_CHANNEL_TABLE: TouchOscBridgeControlChannelTable = {
    0: "fader_1",
    1: "fader_2",
    2: "fader_3",
    3: "fader_4",
    4: "top_fader",
    5: "button_1",
    6: "button_2",
    7: "button_3",
    8: "button_4",
};

export const DEFAULT_TOUCHOSC_CONTROLNAME_TO_CHANNEL_MAPPING: Record<
    TouchOscBridgeControlNames,
    number
> = {
    fader_1: 0,
    fader_2: 1,
    fader_3: 2,
    fader_4: 3,
    top_fader: 4,
    button_1: 5,
    button_2: 6,
    button_3: 7,
    button_4: 8,
};

export const unsetPreference = {
    uiName: "",
    channel: 9999,
};

// export const DEFAULT_XONE_MAPPING_PREFERENCE_TABLE: Record<XONEK2_ControlNames, any> = {

// }

export const DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE: Record<TouchOscBridgeControlNames, any> = {
    fader_1: {
        uiName: "animDuration",
        channel: 0,
    },
    fader_2: unsetPreference,
    fader_3: unsetPreference,
    fader_4: unsetPreference,
    top_fader: {
        uiName: "circleWidth",
        channel: 4,
    },
    button_1: unsetPreference,
    button_2: unsetPreference,
    button_3: unsetPreference,
    button_4: unsetPreference,
};

export const DEFAULT_TOUCHOSC_UI_TO_CONTROLNAME_MAPPING: Record<
    UIInterfaceDeviceName,
    TouchOscBridgeControlNames
> = {
    /**
     * not yet implemented
     */
    button_1_position: "" as any,
    /**
     * not yet implemented
     */
    button_2_position: "" as any,
    /**
     * not yet implemented
     */
    button_3_position: "" as any,
    /**
     * not yet implemented
     */
    button_4_position: "" as any,
    /**
     * not yet implemented
     */
    button_5_position: "" as any,
    /**
     * not yet implemented
     */
    circleWidth: "" as any,
    /**
     * not yet implemented
     */
    vertPos: "" as any,
    /**
     * not yet implemented
     */
    hPos: "" as any,
    /**
     * not yet implemented
     */
    invert: "" as any,
    /**
     * not yet implemented
     */
    animDuration: "" as any,
    resetTimerButton: "button_1",
    animVarCoeff: "fader_1",
    /**
     * never implemented
     */
    resetTimerFn: void 0 as never,
    /**
     * not yet implemented
     */
    isHSL: "" as any,
    /**
     * never implemented
     */
    presetName: void 0 as never,
};

export const DEFAULT_CALLBACK_TABLE: Record<UIInterfaceDeviceName, () => void> = {
    animDuration: () => void 0,
    animVarCoeff: () => void 0,
    button_1_position: () => void 0,
    button_2_position: () => void 0,
    button_3_position: () => void 0,
    button_4_position: () => void 0,
    button_5_position: () => void 0,
    circleWidth: () => void 0,
    hPos: () => void 0,
    invert: () => void 0,
    isHSL: () => void 0,
    presetName: () => void 0,
    resetTimerButton: () => void 0,
    resetTimerFn: () => void 0,
    vertPos: () => void 0,
};

export const ULTRALITE_MK3_HYBRID_SYNC_PORT = {
    /** UNIMPLEMENTED */
};
export const ULTRALITE_MK3_HYBRID_MIDI_PORT = {
    /** UNIMPLEMENTED */
};

export type Nullable<T> = null | T;
export type ControllerName =
    | "Not Found"
    | "UltraLite mk3 Hybrid"
    | "XONE:K2 MIDI"
    | "nanoKontrol2"
    | "UltraLite mk3 Hybrid MIDI Port"
    | "TouchOSC Bridge"
    | "UltraLite mk3 Hybrid Sync Port";

export type MIDIInputName = string & keyof ControllerLookup<ControllerName>;
export type ControllerLookup<Name extends ControllerName> = Record<
    Name,
    Name extends "XONE:K2 MIDI" //-------------------// if
        ? XONEK2_MIDIChannelTable //-----------------// then
        : Name extends "TouchOSC Bridge" //----------// else if
        ? TouchOscBridgeControlChannelTable //------// then
        : Name extends "nanoKontrol2" //-------------// else if
        ? nanoKontrol2_MIDIChannelTable //-----------// then
        : Nullable<Record<number, string>> //--------// else
>;

export type ChannelMappingPreference<N extends MIDIInputName> = N extends "XONE:K2 MIDI"
    ? typeof DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING
    : N extends "TouchOSC Bridge"
    ? typeof DEFAULT_TOUCHOSC_CONTROLNAME_TO_CHANNEL_MAPPING
    : Record<string, never>;

export type UIMappingPreference<N extends MIDIInputName> = N extends "XONE:K2 MIDI"
    ? typeof DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING
    : N extends "TouchOSC Bridge"
    ? typeof DEFAULT_TOUCHOSC_UI_TO_CONTROLNAME_MAPPING
    : Record<string, never>;

export type GenericControlName<Name extends MIDIInputName> = Name extends "XONE:K2 MIDI"
    ? keyof Record<XONEK2_ControlNames, number>
    : Name extends "TouchOSC Bridge"
    ? keyof Record<TouchOscBridgeControlNames, number>
    : string; // unimplemented controller name

export type GenericUIMIDIMappingName<Name extends MIDIInputName> = Name extends "XONE:K2 MIDI"
    ? keyof Record<UIInterfaceDeviceName, XONEK2_ControlNames>
    : Name extends "TouchOSC Bridge"
    ? keyof Record<UIInterfaceDeviceName, TouchOscBridgeControlNames>
    : string; // unimplemented controller name

export const SUPPORTED_CONTROLLERS = {
    "Not Found": {} as any,
    "XONE:K2 MIDI": XONEK2_MIDI_CHANNEL_TABLE,
    "UltraLite mk3 Hybrid": {} as any,
    nanoKontrol2: nanoKontrol2_MIDI_CHANNEL_TABLE,
    "UltraLite mk3 Hybrid Sync Port": ULTRALITE_MK3_HYBRID_SYNC_PORT,
    "UltraLite mk3 Hybrid MIDI Port": ULTRALITE_MK3_HYBRID_MIDI_PORT,
    "TouchOSC Bridge": touchOsc_MIDI_CHANNEL_TABLE,
} as const;
