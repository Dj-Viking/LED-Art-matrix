import { ISignTestTokenArgs } from "../types";
import jwt from "jsonwebtoken";
import { MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, MIDIPortConnectionState, MIDIPortDeviceState, MIDIPortType, TestMIDIAccessRecord, TestMIDIConnectionEvent, TestMIDIMessageEvent } from "./MIDIControlClass";

/**
 * helper class for the testing environment
 * most helper methods are static on this class so no need to instantiate the class to use the methods
 */

interface ITestService {
  inputMap: Map<string, MIDIInput>;
  outputMap: Map<string, MIDIOutput>;
}
export class TestService implements ITestService {

  private _access = null as TestMIDIAccessRecord;
  public inputMap = new Map<string, MIDIInput>();
  public outputMap = new Map<string, MIDIOutput>();

  constructor(access: TestMIDIAccessRecord) {
    this._access = access;
    this.inputMap = this.makeFakeMIDIInputs();
    this.outputMap = this.makeFakeMIDIOutputs();
  }

  /**
   * 
   * @param cssDeclaration style object of the selected element from the virtual DOM 
   * @returns a simple object as { values: string } with the style values object containing the css rules of the selected element
   */
  public static getStyles(cssDeclaration: CSSStyleDeclaration): Record<"values", any> {
    let styleValues = {} as Record<"values", any>;
    Object.keys(cssDeclaration).forEach((key) => {
      // console.log("key", key, ":", gifStyleRef[key as keyof CSSStyleDeclaration]);
      if (key === "_values") {
        styleValues = {
          ...styleValues,
          values: cssDeclaration[key as any]
        };
      }
    });
    return styleValues;
  }

  /**
   * 
   * @param type string key of the global event handlers event map type like "click" or "change"
   * @param props optional object to pass parameters to the new event object
   * @returns a new bubbled event with optional parameters
   */
  public static createBubbledEvent(
    type: keyof GlobalEventHandlersEventMap | "statechange", 
    props = {} as Record<string, any>
  ): Event {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, props);
    return event;
  };

  public static s_makeFakeMIDIInputs(): Map<MIDIInput["id"], MIDIInput> {
    let newMap = new Map<MIDIInput["id"], MIDIInput>();
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("midi input event data test", midi_event.data);
    };
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
      console.log("midi input connection event test", connection_event);
    };

    for (let i = 0; i < 3; i++) {
      newMap?.set(i.toString(), {
        id: i.toString(),
        manufacturer: "holy bajeebus",
        name: "XONE:K2",
        type: MIDIPortType.input,
        version: "over 9000",
        state: MIDIPortDeviceState.connected,
        connection: MIDIPortConnectionState.closed,
        onmidimessage: _onmidicb,
        onstatechange: _onstatechangecb
      } as MIDIInput);
    }
    return newMap;
  }

  public static s_makeFakeMIDIOutputs(): Map<MIDIOutput["id"], MIDIOutput> {
    const newMap = new Map<MIDIOutput["id"], MIDIOutput>();
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void { 
      console.log("output connection event test", connection_event);
    };
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("output midi_event data test", midi_event.data);
    };

    for (let i = 0; i < 3; i++) {
      newMap?.set(i.toString(), {
        id: i.toString(),
        state: MIDIPortDeviceState.connected,
        name: "kdjfkjdj",
        type: MIDIPortType.output,
        version: "kdfkjdj",
        connection: MIDIPortConnectionState.closed,
        onstatechange: _onstatechangecb,
        onmidimessage: _onmidicb
      } as MIDIOutput);
    }
    return newMap;
  }

  public makeFakeMIDIInputs(): Map<MIDIInput["id"], MIDIInput>{
    let newMap = new Map<MIDIInput["id"], MIDIInput>();
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("midi input event data test", midi_event.data);
    };
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
      console.log("midi input connection event test", connection_event);
    };

    for (let i = 0; i < 3; i++) {
      newMap?.set(i.toString(), {
        id: i.toString(),
        manufacturer: "holy bajeebus",
        name: "XONE:K2",
        type: MIDIPortType.input,
        version: "over 9000",
        state: MIDIPortDeviceState.connected,
        connection: MIDIPortConnectionState.closed,
        onmidimessage: _onmidicb,
        onstatechange: _onstatechangecb
      } as MIDIInput);
    }
    return newMap;
  }

  public makeFakeMIDIOutputs(): Map<MIDIOutput["id"], MIDIOutput>{
    const newMap = new Map<MIDIOutput["id"], MIDIOutput>();
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void { 
      console.log("output connection event test", connection_event);
    };
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("output midi_event data test", midi_event.data);
    };

    for (let i = 0; i < 3; i++) {
      newMap?.set(i.toString(), {
        id: i.toString(),
        state: MIDIPortDeviceState.connected,
        name: "kdjfkjdj",
        type: MIDIPortType.output,
        version: "kdfkjdj",
        connection: MIDIPortConnectionState.closed,
        onstatechange: _onstatechangecb,
        onmidimessage: _onmidicb
      } as MIDIOutput);
    }
    return newMap;
  }
/**
 * 
 * @example
  * interface MIDIMessageEvent {
  *    isTrusted: boolean;
  *    bubbles: boolean;
  *    cancelBubble: boolean;
  *    composed: boolean;
  *    currentTarget: MIDIInput;
  *    data: Uint8Array;
  *    defaultPrevented: boolean;
  *    eventPhase: number;
  *    path: Array<any>;
  *    returnValue: boolean;
  *    srcElement: MIDIInput;
  *    target: MIDIInput;
  *    timeStamp: number;
  *    type: "midimessage"
}
 * @returns test midi message event
 */
  public createMIDIMessageEvent(): TestMIDIMessageEvent {
    return {
      isTrusted: true,
      bubbles: true,
      cancelBubble: false,
      composed: false,
      target: this.makeFakeMIDIInputs().get("1") as MIDIInput,
      data: [190, 16, 113]
    };
  }

  /**
   *  
   * @example
   * return {
   *  isTrusted: true,
   *  bubbles: true,
   *  cancelBubble: false,
   *  cancelable: true,
   *  composed: false,
   *  target: this.inputMap.get("1") as MIDIInput
    };
   * @returns test midi connection event
   */
  public createMIDIConnectionEvent(): TestMIDIConnectionEvent {
    return {
      isTrusted: true,
      bubbles: true,
      cancelBubble: false,
      cancelable: true,
      composed: false,
      target: this.inputMap.get("1") as MIDIInput
    };
  }

  public getAccess(): TestMIDIAccessRecord {
    return this._access;
  }

  public static signTestToken(args: ISignTestTokenArgs): string {
    const { 
      uuid: someUuid,
      username,
      email,
      _id,
    } = args;
    const token = jwt.sign(
      {
        someUuid,
        username,
        email,
        _id,
        role: void 0,
      },
      "BLAHBLAHBLAH" as string,
      { expiresIn: "24h" }
    );
    return token;
  }
}