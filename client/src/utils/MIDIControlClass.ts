/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
    open: () => Promise<MIDIPort>
    close: () => Promise<MIDIPort>
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
    readonly port: MIDIPort;
    returnValue: boolean;
    srcElement: MIDIAccessRecord;
    target: MIDIAccessRecord;
    timeStamp: number;
    type: string | "statechange"
}

enum MIDIPortConnectionState {
    "open",
    "closed",
    "pending"
};
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
    type: "midimessage"
}

// type MIDIEventHandlers  = 
//     null | ((event: MIDIMessageEvent) => unknown) |
//     null | ((event: MIDIConnectionEvent) => unknown) | undefined | unknown;


interface MIDIInput {
    id: string;
    manufacturer: string;
    name: string;
    type: "input" | string;
    version: string;
    state: "connected" | string;
    connection: MIDIPortConnectionState
    onmidimessage: (event: MIDIMessageEvent) => unknown | null | undefined;
    onstatechange: onstatechangeHandler | undefined;
}
interface MIDIOutput {
    connection: "closed" | "open" | string;
    id: string;
    manufacturer: string;
    name: string;
    type: "output" | string;
    state: "connected" | string;
    version: string;
    onstatechange: onstatechangeHandler
    onmidimessage: null | ((event: MIDIMessageEvent) => unknown);
}
type onstatechangeHandler = null | ((event: MIDIConnectionEvent) => unknown);
interface MIDIAccessRecord {
    readonly inputs: Map<MIDIInput["id"], MIDIInput>;
    readonly outputs: Map<MIDIOutput["id"], MIDIOutput>;
    onstatechange: onstatechangeHandler | null;
    readonly sysexEnabled: boolean;
}

interface IMIDIController {
    inputs?: Array<MIDIInput>;
    outputs?: Array<MIDIOutput>;
    online?: boolean;
    getInstance: () => this;
    getAccess: () => MIDIAccessRecord;
}

class MIDIController implements IMIDIController {
    private access = null as MIDIAccessRecord | null;
    public inputs = [] as Array<MIDIInput> | undefined;
    public outputs = [] as Array<MIDIOutput> | undefined;
    public online = false;
    constructor(
        access: MIDIAccessRecord, 
    ) {
        if (access)
            this.access = access;
        if (!!this.access && !!this.access.inputs.size) {
            this.online = true;
            this._setInputs(access.inputs);
            this._setOutputs(access.outputs);
        }
    }

    public static async requestMIDIAccess(): Promise<MIDIAccessRecord> {
        // @ts-ignore because for some reason in vscode
        // this method doesn't exist on the navigator I guess..
        return window.navigator.requestMIDIAccess();
    }
    
    public getInstance(): this {
        return this;
    }


    public getAccess(): MIDIAccessRecord {
        return this.access as MIDIAccessRecord;
    }

    private _setOutputs(outputs: Map<string, MIDIOutput>): void {

        if (outputs.size > 0) {
            const MIDI_OUTPUT_LIST_SIZE = outputs.size;
            const entries = outputs.entries();

            for (let i = 0; i < MIDI_OUTPUT_LIST_SIZE; i++) {
                this.outputs!.push(entries.next().value[1]);
            }
            // for (let j = 0; j < this.outputs!.length; j++) {
            //     this.outputs![j].onstatechange = function (event: MIDIConnectionEvent) {
            //         console.log("output onstatechange event", event);
            //     };
            //     this.outputs![j].onmidimessage = function (event: MIDIMessageEvent) {
            //         console.log("output midimessage event", event);
            //     };
            // }
        }

    }
    public _setInputs(inputs: Map<string, MIDIInput>): void {

        if (inputs.size > 0) {
            const MIDI_INPUT_LIST_SIZE = inputs.size;
            const entries = inputs.entries();

            for (let i = 0; i < MIDI_INPUT_LIST_SIZE; i++) {
                this.inputs!.push(entries.next().value[1]);
            }
        }

    }

    public setInputCbs(
        // _onmidicb: (event: MIDIMessageEvent) => unknown, 
        // _onstatechangecb: (event: MIDIConnectionEvent) => unknown
    ): this {
        console.log("SETTING INPUT CBS I THINK");
        
        // this following loop sort of is confirming my theory that this class can
            // have ownership of what's passed to it maybe?? not too sure if things are passed by memory values or references to class constructors
            // in JS
        for (let j = 0; j < this.inputs!.length; j++) {
            
            //this effectively sets connection "open" somehow?? to send/recieve with hardware
            // this.inputs![j].onstatechange = _onstatechangecb;
            // uncomment below and comment out the line above to see midi message in the browser!!!
            this.inputs![j].onstatechange = function (event: MIDIConnectionEvent) {
                console.log("input onstatechange event", event);
            };
            
            //this effectively sets connection "open" somehow?? to send/recieve with hardware
            // this.inputs![j].onmidimessage = _onmidicb;
            // uncomment below and comment out the line above to see midi message in the browser!!!
            this.inputs![j].onmidimessage = function (event: MIDIMessageEvent) {
                console.log("input midimessage event hello world!!!", event);
            };
        }
                    
        console.log("SETTING INPUT CBS I THINK", this);
        return this;
    }

}


export type {
    MIDIConnectionEvent,
    MIDIInput,
    MIDIOutput,
    MIDIPort,
    MIDIAccessRecord,
    onstatechangeHandler,
    MIDIMessageEvent
};
export { MIDIController, MIDIPortConnectionState };