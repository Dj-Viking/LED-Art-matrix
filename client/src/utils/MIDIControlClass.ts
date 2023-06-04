/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { artScrollerActions } from "../store/artScrollerSlice";
import { ledActions } from "../store/ledSlice";
import {
    MIDIInputName,
    XONEK2_MIDI_CHANNEL_TABLE,
    touchOsc_MIDI_CHANNEL_TABLE,
} from "../constants";
import { PresetButtonsList } from "./PresetButtonsListClass";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { midiActions } from "../store/midiSlice";
import { ToolkitDispatch } from "../store/store";
/**
 * @see https://www.w3.org/TR/webmidi/#idl-def-MIDIPort
 * interface MIDIPort : EventTarget {
    readonly    attribute DOMString               id;
    readonly    attribute DOMString?              manufacturer;
    readonly    attribute DOMString?              name;
    readonly    attribute MIDIPortType            type;
    readonly    attribute DOMString?              version;
    readonly    attribute MIDIPortDeviceState     state;
    readonly    attribute MIDIPortConnectionState connection;
                attribute EventHandler            onstatechange;
    Promise<MIDIPort> open ();
    Promise<MIDIPort> close ();
};
 */
interface MIDIPort {
    IODevice: MIDIInput | MIDIOutput;
    open: () => Promise<MIDIPort>;
    close: () => Promise<MIDIPort>;
}
interface TestMIDIConnectionEvent {
    isTrusted: boolean;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    target: MIDIInput;
}
interface MIDIConnectionEvent {
    isTrusted: boolean;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    currentTarget: MIDIAccessRecord;
    defaultPrevented: boolean;
    eventPhase: number;
    path: Array<any>;
    readonly PORT: MIDIPort;
    returnValue: boolean;
    srcElement: MIDIAccessRecord;
    target: MIDIAccessRecord;
    timeStamp: number;
    type: string | "statechange";
}
enum MIDIPortType {
    input = "input",
    output = "output",
}
enum MIDIPortConnectionState {
    open = "open",
    closed = "closed",
    pending = "pending",
}
enum MIDIPortDeviceState {
    disconnected = "disconnected",
    connected = "connected",
}

interface TestMIDIMessageEvent {
    isTrusted: boolean;
    bubbles: boolean;
    cancelBubble: boolean;
    composed: boolean;
    target: MIDIInput;
    data: [number, number, number];
}

interface MIDIMessageEvent {
    isTrusted: boolean;
    bubbles: boolean;
    cancelBubble: boolean;
    composed: boolean;
    currentTarget: MIDIInput;
    data: Uint8Array;
    defaultPrevented: boolean;
    eventPhase: number;
    path: Array<any>;
    returnValue: boolean;
    srcElement: MIDIInput;
    target: MIDIInput;
    timeStamp: number;
    type: "midimessage";
}

type onstatechangeHandler = null | ((event: MIDIConnectionEvent) => unknown);
interface MIDIInput {
    id: string;
    manufacturer: string;
    name: MIDIInputName;
    type: MIDIPortType.input;
    version: string;
    state: MIDIPortDeviceState;
    connection: MIDIPortConnectionState | string;
    onstatechange: undefined | onstatechangeHandler;
    onmidimessage: undefined | null | ((event: MIDIMessageEvent) => unknown);
}
interface MIDIOutput {
    connection: MIDIPortConnectionState;
    id: string;
    manufacturer: string;
    name: string;
    type: MIDIPortType.output;
    state: MIDIPortDeviceState;
    version: string;
    onstatechange: undefined | onstatechangeHandler;
    onmidimessage: undefined | null | ((event: MIDIMessageEvent) => unknown);
}

type TestMIDIAccessRecord = null | {
    readonly inputs: Map<MIDIInput["id"], MIDIInput>;
    readonly outputs: Map<MIDIOutput["id"], MIDIOutput>;
    onstatechange: null | ((event: TestMIDIConnectionEvent) => unknown);
    readonly sysexEnabled: boolean;
};
interface MIDIAccessRecord {
    readonly inputs: Map<MIDIInput["id"], MIDIInput>;
    readonly outputs: Map<MIDIOutput["id"], MIDIOutput>;
    onstatechange: onstatechangeHandler;
    readonly sysexEnabled: boolean;
}

interface IMIDIController {
    inputs?: Array<MIDIInput>;
    inputs_size: number;
    outputs_size: number;
    outputs?: Array<MIDIOutput>;
    online?: boolean;
    getInstance: () => this;
}

class MIDIController implements IMIDIController {
    public access = {} as MIDIAccessRecord;
    public inputs = [] as Array<MIDIInput>;
    public inputs_size = 0;
    public outputs_size = 0;
    public outputs = [] as Array<MIDIOutput>;
    public online = false;

    public constructor(access: MIDIAccessRecord) {
        this.access = access;
        this.online = true;
        this.inputs_size = access!.inputs.size;
        this.outputs_size = access!.outputs.size;
        this._setInputs(access!.inputs);
        this._setOutputs(access!.outputs);
    }

    public static async requestMIDIAccess(): Promise<MIDIAccessRecord> {
        return window.navigator.requestMIDIAccess();
    }

    public getInstance(): this {
        return this;
    }

    public setOutputCbs(): this {
        // OUTPUT CBS SETTING HERE
        for (let j = 0; j < this.outputs!.length; j++) {
            this.outputs![j].onstatechange = function (_event: MIDIConnectionEvent) {
                // console.log("output onstatechange event", event);
            };
            this.outputs![j].onmidimessage = function (_event: MIDIMessageEvent) {
                // console.log("output midimessage event", event);
            };
        }
        return this;
    }

    /**
        * this following loop sort of is confirming my theory that this class can
         have ownership callbacks passed to it maybe?? 
         
        * not too sure if things are passed by memory values or references into the class constructors
         in JS
        this effectively sets connection "open" on the devices somehow?? to send/recieve with hardware
     */
    public setInputCbs(
        _onmidicb?: (event: MIDIMessageEvent) => unknown,
        _onstatechangecb?: (event: MIDIConnectionEvent) => unknown
    ): this {
        for (let j = 0; j < this.inputs!.length; j++) {
            this.inputs![j].onstatechange = _onstatechangecb;
            this.inputs![j].onmidimessage = _onmidicb;
        }
        return this;
    }

    private _setOutputs(outputs: Map<string, MIDIOutput>): void {
        if (outputs.size > 0) {
            const MIDI_OUTPUT_LIST_SIZE = outputs.size;
            const entries = outputs.entries();

            for (let i = 0; i < MIDI_OUTPUT_LIST_SIZE; i++) {
                this.outputs!.push(entries.next().value[1]);
            }
        }
    }

    private _setInputs(inputs: Map<string, MIDIInput>): void {
        if (inputs.size > 0) {
            const MIDI_INPUT_LIST_SIZE = inputs.size;
            const entries = inputs.entries();

            for (let i = 0; i < MIDI_INPUT_LIST_SIZE; i++) {
                this.inputs!.push(entries.next().value[1]);
            }
        }
    }

    public static stripNativeLabelFromMIDIInputName(name: string): MIDIInputName {
        return name.replace(/(\d-\s)/g, "") as MIDIInputName;
    }

    public static mapMIDIChannelToInterface(_midi_event: MIDIMessageEvent): void {
        // console.log("midi event reached edit mode", _midi_event);
    }

    public static handleTouchOSCMessage(
        midi_event: MIDIMessageEvent,
        _dispatchcb: React.Dispatch<any>
    ): void {
        const midi_intensity = midi_event.data[2];
        const midi_channel = midi_event.data[1];

        _dispatchcb(midiActions.setControllerInUse("TouchOSC Bridge"));
        _dispatchcb(midiActions.setChannel(midi_channel));
        _dispatchcb(midiActions.setIntensity(midi_intensity));

        // TODO render svgs for showing it's touch osc
        // touch osc logo?

        switch (touchOsc_MIDI_CHANNEL_TABLE[midi_channel]) {
            case "fader_1":
                _dispatchcb(
                    ledActions.setAnimVarCoeff(
                        (midi_intensity === 0 ? "1" : midi_intensity * 2).toString()
                    )
                );
                break;
            default:
                break;
        }
    }

    public static handleXONEK2MIDIMessage(
        midi_event: MIDIMessageEvent,
        _dispatchcb: ToolkitDispatch,
        _buttonIds: string[]
    ): void {
        const midi_intensity = midi_event.data[2];
        const midi_channel = midi_event.data[1];

        _dispatchcb(midiActions.setControllerInUse("XONE:K2 MIDI"));
        _dispatchcb(midiActions.setChannel(midi_channel));
        _dispatchcb(midiActions.setIntensity(midi_intensity));

        const is_fader = /fader/g.test(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]);
        const is_knob = /knob/g.test(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]);

        _dispatchcb(
            midiActions.determineDeviceControl({
                usingFader: is_fader,
                usingKnob: is_knob,
            })
        );

        // TODO: when redux toolkit is in - we set styling based on our access to the whole state tree
        // and not what we are passing into this handler because passing state stuff in here
        // while it is changing causes memory leaks
        switch (XONEK2_MIDI_CHANNEL_TABLE[midi_channel]) {
            case "1_a_button":
                if (midi_intensity === 127) {
                    _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[0]));

                    PresetButtonsList.setStyle(
                        _dispatchcb,
                        "rainbowTest",
                        midi_intensity.toString()
                    );
                }
                break;
            case "1_b_button":
                if (midi_intensity === 127) {
                    _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[1]));

                    PresetButtonsList.setStyle(_dispatchcb, "v2", midi_intensity.toString());
                }
                break;
            case "1_c_button":
                if (midi_intensity === 127) {
                    _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[2]));

                    PresetButtonsList.setStyle(_dispatchcb, "waves", midi_intensity.toString());
                }
                break;
            case "1_d_button":
                if (midi_intensity === 127) {
                    _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[3]));

                    PresetButtonsList.setStyle(_dispatchcb, "spiral", midi_intensity.toString());
                }
                break;
            case "2_e_button":
                if (midi_intensity === 127) {
                    _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[4]));

                    PresetButtonsList.setStyle(_dispatchcb, "dm5", midi_intensity.toString());
                }
                break;
            case "1_middle_button":
                if (midi_intensity === 127) {
                    _dispatchcb(midiActions.toggleMidiEditMode());
                }
                break;
            case "1_upper_knob": // dispatch whatever the current binding is supposed to change
                _dispatchcb(
                    artScrollerActions.setSlider({
                        control: "circleWidth",
                        value: midi_intensity.toString(),
                    })
                );
                break;
            case "1_middle_knob":
                _dispatchcb(
                    artScrollerActions.setSlider({
                        control: "vertPos",
                        value: midi_intensity.toString(),
                    })
                );
                break;
            case "1_lower_knob":
                _dispatchcb(
                    artScrollerActions.setSlider({
                        control: "hPos",
                        value: midi_intensity.toString(),
                    })
                );
                break;
            case "2_upper_knob":
                _dispatchcb(
                    artScrollerActions.setSlider({
                        control: "invert",
                        value: midi_intensity.toString(),
                    })
                );
                break;
            case "2_middle_knob":
                _dispatchcb(
                    artScrollerActions.setSlider({
                        control: "animDuration",
                        value: midi_intensity <= 0 ? "1" : midi_intensity.toString(),
                    })
                );
                break;
            case "1_lower_button": // reset timer button
                if (midi_intensity === 127) {
                    _dispatchcb((_dispatch, getState) => getState().ledState.resetTimerFn());
                }
                break;
            case "1_fader":
                // debounce? not sure if this helps...
                _dispatchcb(
                    ledActions.setAnimVarCoeff(
                        (midi_intensity === 0 ? "1" : midi_intensity * 2).toString()
                    )
                );
                break;
            default:
                break;
        }
    }
}

export type {
    MIDIConnectionEvent,
    MIDIInput,
    MIDIOutput,
    MIDIPort,
    MIDIAccessRecord,
    onstatechangeHandler,
    MIDIMessageEvent,
    TestMIDIAccessRecord,
    TestMIDIMessageEvent,
    TestMIDIConnectionEvent,
};

export { MIDIController, MIDIPortConnectionState, MIDIPortDeviceState, MIDIPortType };
