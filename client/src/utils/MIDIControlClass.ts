interface MIDIPort {
  IODevice: MIDIInput | MIDIOutput;
  open: () => Promise<MIDIPort>
  close: () => Promise<MIDIPort>
} 
interface MIDIConnectionEvent {
  readonly port: MIDIPort
}
/**
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
  onstatechange: (event: MIDIConnectionEvent) => unknown | null;
}
interface MIDIOutput {
  connection: "closed" | "open" | string;
  id: string;
  manufacturer: string;
  name: string;
  type: "output" | string;
  state: "connected" | string;
  version: string;
  onstatechange: (event: MIDIConnectionEvent) => unknown | null;
  onmidimessage: () => unknown | null;
}

interface AccessRecord {
  readonly inputs: Map<string, MIDIInput>;
  readonly outputs: Map<string, MIDIOutput>
  onstatechange: null | unknown;
  readonly sysexEnabled: boolean;
}

interface IMIDIController {
  inputs: Array<MIDIInput>;
  outputs: Array<MIDIOutput>;
  online: boolean;
}

class MIDIController implements IMIDIController {
  private access = null as AccessRecord | null;
  public inputs = [] as Array<MIDIInput>;
  public outputs = [] as Array<MIDIOutput>;
  public online = false;
  constructor(access: AccessRecord) {
    if (access) 
      this.access = access;
      if (!!this.access && !!this.access.inputs) {
        this.online = true;
        this.getInputs(this.access.inputs);
        this.getOutputs(this.access.outputs);
    }
  }

  private getOutputs(outputs: Map<string, MIDIOutput>): void {

    const MIDI_OUTPUT_LIST_SIZE = outputs.size;
    const entries = outputs.entries();

    if (MIDI_OUTPUT_LIST_SIZE > 0) {
      for (let i = 0; i < MIDI_OUTPUT_LIST_SIZE; i++) {
        this.outputs.push(entries.next().value[1]);
      }
    }

  }
  private getInputs(inputs: Map<string, MIDIInput>): void {

    const MIDI_INPUT_LIST_SIZE = inputs.size;
    const entries = inputs.entries();

    if (MIDI_INPUT_LIST_SIZE > 0) {
      for (let i = 0; i < MIDI_INPUT_LIST_SIZE; i++) {
        this.inputs.push(entries.next().value[1]);
      }
    }

  }
}


export { MIDIController };