/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    MIDIInputName,
    XONEK2_MIDI_CHANNEL_TABLE,
    touchOsc_MIDI_CHANNEL_TABLE,
    GenericControlName,
    UIInterfaceDeviceName,
    getControllerTableFromName,
} from "../constants";
import { midiActions } from "../store/midiSlice";
import { ToolkitDispatch } from "../store/store";
import { MIDIMappingPreference, CallbackMapping } from "./MIDIMappingClass";
import { deepCopy } from "./deepCopy";
import { IPresetButton } from "../types";
import { UNIMPLEMENTED } from "../store/actions/midiActionCreators";
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
    recentlyUsed: MIDIInputName;
    controllerPreference: {
        hasPreference: boolean;
        midiMappingPreference: MIDIMappingPreference<MIDIInputName>;
    };
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
    public recentlyUsed: MIDIInputName = "TouchOSC Bridge";
    public controllerPreference: IMIDIController["controllerPreference"] = {
        hasPreference: true,
        midiMappingPreference: {} as any,
    };

    public constructor(access: MIDIAccessRecord, dispatch: ToolkitDispatch) {
        this.access = access;
        this.online = true;
        this.inputs_size = access!.inputs.size;
        this.outputs_size = access!.outputs.size;
        this.controllerPreference = {
            hasPreference: true,
            midiMappingPreference: new MIDIMappingPreference("TouchOSC Bridge", dispatch),
        };
        this._setInputs(access!.inputs);
        this._setOutputs(access!.outputs);
        this._initLocalStoragePreferencesIfNotExists(dispatch);
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

    public static getMIDIMappingPreferenceFromStorage(
        name: MIDIInputName,
        hasPreference: boolean // TODO: implement logic for has preference false if the preference doesn't exist yet and initialize it as something default
    ): MIDIMappingPreference<typeof name> {
        // TODO: update the data structure for what is stored in local storage
        const result = MIDIController.getTypedMIDILocalStorage(name);
        return result;
    }

    public static getTypedMIDILocalStorage(name: MIDIInputName): MIDIMappingPreference<typeof name> {
        return JSON.parse(window.localStorage.getItem(name)!) as MIDIMappingPreference<typeof name>;
    }

    public static isMIDIPreferenceLocalStorageSet(name: MIDIInputName, dispatch: ToolkitDispatch): boolean {
        // add more preferences
        const hasPreferencesSet = !!window.localStorage.getItem(name);
        dispatch(midiActions.setHasPreferencesSet(hasPreferencesSet));
        return !!window.localStorage.getItem(name);
    }

    // TODO: set in local storage and/or the api database of user preferences
    public static mapMIDIChannelToInterface(
        name: MIDIInputName,
        controlName: GenericControlName<typeof name>,
        channel: number,
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): void {
        // set in storage and also update the redux state for the mappings

        MIDIController.setMIDIMappingPreferenceInStorage(name, controlName, channel, uiName, dispatch);
    }

    public static setTypedMIDIPreferenceLocalStorage(
        name: MIDIInputName,
        controlName: GenericControlName<typeof name>,
        channel: number,
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): CallbackMapping<MIDIInputName> {
        // have to create a copy otherwise these nested properties are read-only by default in JS classes (head asplode)

        let newPref = deepCopy(new MIDIMappingPreference(name, dispatch));

        // TODO: unset the previous mapping if it already exists on a different control
        // get the current one
        // this currently only works against controls that don't have default mappings already
        // # BUG
        /**
         * @see https://github.com/Dj-Viking/LED-Art-matrix/issues/178
         */
        const currentPref = MIDIController.getMIDIMappingPreferenceFromStorage(name, true);
        if (
            currentPref.mapping[controlName].channel === channel &&
            currentPref.mapping[controlName].uiName === uiName
        ) {
            currentPref.mapping[controlName].channel = 9999;
            currentPref.mapping[controlName].uiName = "";
            window.localStorage.setItem(name, JSON.stringify(currentPref));
        }

        // overwrite new mapping with the inputs to this function
        // somehow check which controls are mapped already and if they already have
        // a channel assigned to them which is the same as the one we're trying to assign
        // then unset it to the default un-set values

        // TODO-NOTE:
        // right now multiple channels could be mapped to the same ui control interface
        newPref.mapping = {
            ...currentPref.mapping,
            [controlName]: {
                channel,
                uiName,
            },
        };

        window.localStorage.setItem(name, JSON.stringify(newPref));

        MIDIMappingPreference.setMIDICallbackMapBasedOnControllerName(newPref, dispatch);

        return newPref.callbackMap;
    }

    // TODO:
    public static setMIDIMappingPreferenceInStorage(
        name: MIDIInputName,
        controlName: GenericControlName<typeof name>,
        channel: number,
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): void {
        // TODO: set in local storage for now
        const newCallbackMap = MIDIController.setTypedMIDIPreferenceLocalStorage(
            name,
            controlName,
            channel,
            uiName,
            dispatch
        );
        dispatch(midiActions.setCallbackMap(newCallbackMap));
    }

    // for each new midi controller to support this has to be expanded
    private _initLocalStoragePreferencesIfNotExists(dispatch: ToolkitDispatch): void {
        let pref = null;
        // unfortunately functions are not serializable to JSON in local storage
        if (!window.localStorage.getItem("TouchOSC Bridge" as MIDIInputName)) {
            // create
            const initPref = new MIDIMappingPreference("TouchOSC Bridge", dispatch);
            pref = initPref;
            console.log("pref to initialize into local storage", pref);
            window.localStorage.setItem("TouchOSC Bridge" as MIDIInputName, JSON.stringify(initPref));
            const gotPref = window.localStorage.getItem("TouchOSC Bridge")!;
            console.log("got pref from local storage", JSON.parse(gotPref));
        }

        if (!window.localStorage.getItem("XONE:K2 MIDI" as MIDIInputName)) {
            // create
            const initPref = new MIDIMappingPreference("XONE:K2 MIDI", dispatch);
            pref = initPref;
            console.log("pref to initialize into local storage", pref);
            window.localStorage.setItem("XONE:K2 MIDI" as MIDIInputName, JSON.stringify(initPref));
            const gotPref = window.localStorage.getItem("XONE:K2 MIDI")!;
            console.log("got pref from local storage", JSON.parse(gotPref));
        }
    }

    public static handleMIDIMessage(
        midi_event: MIDIMessageEvent,
        _dispatchcb: ToolkitDispatch,
        pref: MIDIMappingPreference<typeof name>,
        name: MIDIInputName,
        buttonIds: Array<IPresetButton["id"]>
    ): void {
        MIDIController._invokeCallbackOrWarn(pref, name, midi_event, buttonIds);
    }

    private static _invokeCallbackOrWarn(
        pref: MIDIMappingPreference<typeof name>,
        name: MIDIInputName,
        midi_event: MIDIMessageEvent,
        buttonIds: IPresetButton["id"][]
    ): void {
        //
        const channel = midi_event.data[1];
        const midiIntensity = midi_event.data[2];

        switch (name) {
            case "TouchOSC Bridge":
                {
                    const callbackMap = pref.callbackMap;
                    const mapping = pref.mapping;
                    const callback = callbackMap[mapping[touchOsc_MIDI_CHANNEL_TABLE[channel]].uiName];
                    if (MIDIController._warnCallbackIfError(callback, mapping, channel, name)) {
                        callback(midiIntensity, buttonIds);
                    }
                }
                break;
            case "XONE:K2 MIDI":
                {
                    const callbackMap = pref.callbackMap;
                    const mapping = pref.mapping;
                    const callback = callbackMap[mapping[XONEK2_MIDI_CHANNEL_TABLE[channel]].uiName];
                    if (MIDIController._warnCallbackIfError(callback, mapping, channel, name)) {
                        callback(midiIntensity, buttonIds);
                    }
                }
                break;
            default: {
                UNIMPLEMENTED(name, midi_event, channel);
            }
        }
    }

    private static _warnCallbackIfError<N extends MIDIInputName, P extends keyof CallbackMapping<N>>(
        callback: CallbackMapping<typeof name>[P],
        mapping: MIDIMappingPreference<typeof name>["mapping"],
        midi_channel: number,
        name: MIDIInputName
    ): boolean {
        if (typeof callback !== "function") {
            console.warn(
                "callback was not a function, cannot proceed to call the callback",
                "\n callback was => ",
                callback,
                "\n mapping was => ",
                mapping,
                "\n control name was => ",
                getControllerTableFromName(name)[midi_channel]
            );
            console.warn("did you assign a ui control to that midi control?");
            return false;
        }
        return true;
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
