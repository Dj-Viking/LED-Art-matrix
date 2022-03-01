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

interface MIDIInput {
  id: string;
  manufacturer: string;
  name: string;
  type: "input" | string;
  version: string;
  state: "connected" | string;
  connection: MIDIPortConnectionState
  onmidimessage: () => unknown | null;
  onstatechange: onstatechangeHandler
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
  onmidimessage: () => unknown | null;
}
type onstatechangeHandler = (event: MIDIConnectionEvent) => unknown | null;
interface MIDIAccessRecord {
  readonly inputs: Map<string, MIDIInput>;
  readonly outputs: Map<string, MIDIOutput>;
  onstatechange: onstatechangeHandler;
  readonly sysexEnabled: boolean;
}

interface IMIDIController {
  inputs: Array<MIDIInput>;
  outputs: Array<MIDIOutput>;
  online: boolean;
}

class MIDIController implements IMIDIController {
  private access = null as MIDIAccessRecord | null;
  public inputs = [] as Array<MIDIInput>;
  public outputs = [] as Array<MIDIOutput>;
  public online = false;
  constructor(access: MIDIAccessRecord) {
    if (access) 
      this.access = access;
    if (!!this.access && !!this.access.inputs.size) {
      this.online = true;
      this.setInputs(this.access.inputs);
      this.setOutputs(this.access.outputs);
    }
  }

  public static async requestMIDIAccess(): Promise<MIDIAccessRecord> {
    // @ts-ignore because for some reason in vscode
    // this method doesn't exist on the navigator I guess..
    return await window.navigator.requestMIDIAccess();
  }

  private setOutputs(outputs: Map<string, MIDIOutput>): void {

    if (outputs.size > 0) {
      const MIDI_OUTPUT_LIST_SIZE = outputs.size;
      const entries = outputs.entries();

      for (let i = 0; i < MIDI_OUTPUT_LIST_SIZE; i++) {
        this.outputs.push(entries.next().value[1]);
      }
    }

  }
  private setInputs(inputs: Map<string, MIDIInput>): void {

    if (inputs.size > 0) {
      const MIDI_INPUT_LIST_SIZE = inputs.size;
      const entries = inputs.entries();

      for (let i = 0; i < MIDI_INPUT_LIST_SIZE; i++) {
        this.inputs.push(entries.next().value[1]);
      }
    }

  }
}


export type {
  MIDIConnectionEvent, 
  MIDIInput, 
  MIDIOutput, 
  MIDIPort, 
  MIDIAccessRecord
};
export { MIDIController, MIDIPortConnectionState };