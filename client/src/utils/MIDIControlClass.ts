/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { artScrollerActions } from "../reducers/artScrollerSlice";
import { ledActions } from "../reducers/ledSlice";
import { determineDeviceControl, setAccess } from "../actions/midi-access-actions";
import { MIDIInputName, XONEK2_MIDI_CHANNEL_TABLE } from "../constants";
import { PresetButtonsList } from "./PresetButtonsListClass";
import { presetButtonsListActions } from "../reducers/presetButtonListSlice";

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
        // @ts-ignore because for some reason in vscode
        // this method doesn't exist on the navigator I guess..
        // only supported in chrome mostly for now
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

    public static mapMIDIChannelToController(midi_event: MIDIMessageEvent): void {
        console.log("midi event", midi_event);
    }

    public static handleXONEK2MIDIMessage(
        midi_event: MIDIMessageEvent,
        _setChannel: (channel: number) => void,
        _setIntensity: (intensity: number) => void,
        _dispatchcb: React.Dispatch<any>,
        timeoutRef: React.MutableRefObject<NodeJS.Timeout>,
        _buttonIds: string[]
    ): void {
        clearTimeout(timeoutRef.current);
        const midi_intensity = midi_event.data[2];
        const midi_channel = midi_event.data[1];

        _setChannel(midi_channel);
        _setIntensity(midi_intensity);

        const is_fader = /fader/g.test(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]);
        const is_knob = /knob/g.test(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]);

        _dispatchcb(
            determineDeviceControl({
                usingFader: is_fader,
                usingKnob: is_knob,
            })
        );

        switch (XONEK2_MIDI_CHANNEL_TABLE[midi_channel]) {
            case "1_a_button":
                timeoutRef.current = setTimeout(() => {
                    // TODO: when redux toolkit is in - we set styling based on our access to the whole state tree
                    // and not what we are passing into this handler because passing state stuff in here
                    // while it is changing causes memory leaks
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[0]));

                        PresetButtonsList.setStyle(
                            _dispatchcb,
                            "rainbowTest",
                            midi_intensity.toString()
                        );
                    }
                }, 20);
                break;
            case "1_b_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[1]));

                        PresetButtonsList.setStyle(_dispatchcb, "v2", midi_intensity.toString());
                    }
                }, 20);
                break;
            case "1_c_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[2]));

                        PresetButtonsList.setStyle(_dispatchcb, "waves", midi_intensity.toString());
                    }
                }, 20);
                break;
            case "1_d_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[3]));

                        PresetButtonsList.setStyle(
                            _dispatchcb,
                            "spiral",
                            midi_intensity.toString()
                        );
                    }
                }, 20);
                break;
            case "2_e_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[4]));

                        PresetButtonsList.setStyle(
                            _dispatchcb,
                            "fourSpirals",
                            midi_intensity.toString()
                        );
                    }
                }, 20);
                break;
            case "2_f_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.setActiveButton(_buttonIds[5]));

                        PresetButtonsList.setStyle(_dispatchcb, "dm5", midi_intensity.toString());
                    }
                }, 20);
                break;
            case "1_lower_button":
                timeoutRef.current = setTimeout(() => {
                    if (midi_intensity === 127) {
                        _dispatchcb(presetButtonsListActions.toggleMidiMode());
                    }
                }, 20);
                break;
            case "1_upper_knob":
                timeoutRef.current = setTimeout(() => {
                    artScrollerActions.setSlider({
                        control: "circleWidth",
                        value: midi_intensity.toString(),
                    });
                }, 20);
                break;
            case "1_middle_knob":
                timeoutRef.current = setTimeout(() => {
                    artScrollerActions.setSlider({
                        control: "vertPos",
                        value: midi_intensity.toString(),
                    });
                }, 20);
                break;
            case "1_lower_knob":
                timeoutRef.current = setTimeout(() => {
                    artScrollerActions.setSlider({
                        control: "hPos",
                        value: midi_intensity.toString(),
                    });
                }, 20);
                break;
            case "2_upper_knob":
                timeoutRef.current = setTimeout(() => {
                    artScrollerActions.setSlider({
                        control: "invert",
                        value: midi_intensity.toString(),
                    });
                }, 20);
                break;
            case "2_middle_knob":
                timeoutRef.current = setTimeout(() => {
                    _dispatchcb(
                        artScrollerActions.setSlider({
                            control: "animDuration",
                            value: midi_intensity <= 0 ? "1" : midi_intensity.toString(),
                        })
                    );
                }, 20);
                break;
            case "1_fader":
                timeoutRef.current = setTimeout(() => {
                    _dispatchcb(
                        ledActions.setAnimVarCoeff(
                            (midi_intensity === 0 ? "1" : midi_intensity * 2).toString()
                        )
                    );
                }, 10);
                break;
            default:
                break;
        }
    }

    public static async setupMIDI(
        dispatchcb: React.Dispatch<any>,
        _setChannel: (channel: number) => void,
        _setIntensity: (intensity: number) => void,
        timeoutRef: React.MutableRefObject<NodeJS.Timeout>,
        _buttonIds: string[],
        _midiEditMode: boolean,
        _access: MIDIAccessRecord
    ): Promise<MIDIController> {
        return new Promise<MIDIController>((resolve) => {
            _access.onstatechange = (_event: MIDIConnectionEvent): void => {
                const onstatechangeAccess = new MIDIController(_event.target).getInstance();

                const midicb = function (midi_event: MIDIMessageEvent): void {
                    console.log("midi edit mode", _midiEditMode);
                    if (_midiEditMode) {
                        return MIDIController.mapMIDIChannelToController(midi_event);
                    }
                    if (midi_event.currentTarget.name.includes("XONE:K2")) {
                        return MIDIController.handleXONEK2MIDIMessage(
                            midi_event,
                            _setChannel,
                            _setIntensity,
                            dispatchcb,
                            timeoutRef,
                            _buttonIds
                        );
                    }
                };

                const onstatechangecb = function (_connection_event: MIDIConnectionEvent): void {
                    // console.log("CONNECTION EVENT SET INPUT CB CALLBACK", _connection_event);
                };

                dispatchcb(setAccess(onstatechangeAccess, midicb, onstatechangecb));
                resolve(onstatechangeAccess);
            }; // end onstatechange def
        });
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
