import { ApiService, IApiService } from "./ApiService";
import { ISignTestTokenArgs } from "../types";
import jwt from "jsonwebtoken";
import { MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, MIDIPortConnectionState } from "./MIDIControlClass";
import { keyGen } from "./keyGen";

/**
 * helper class for the testing environment
 * most helper methods are static on this class so no need to instantiate the class to use the methods
 */
export class TestService extends ApiService implements IApiService {

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

  public static makeFakeMIDIInputs(): Map<MIDIInput["id"], MIDIInput>{
    let newMap = new Map<MIDIInput["id"], MIDIInput>();
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("midi input event data test", midi_event.data);
    };
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
      console.log("midi input connection event test", connection_event);
    };

    for (let i = 0; i < 3; i++) {
      const id = keyGen();
      newMap?.set(id, {
        id,
        manufacturer: "holy bajeebus",
        name: "holy jeebus MIDI power thing",
        type: "input",
        version: "over 9000",
        state: "connected",
        connection: MIDIPortConnectionState.closed,
        onmidimessage: _onmidicb,
        onstatechange: _onstatechangecb
      } as MIDIInput);
    }
    return newMap;
  }

  public static makeFakeMIDIOutputs(): Map<MIDIOutput["id"], MIDIOutput>{
    const newMap = new Map<MIDIOutput["id"], MIDIOutput>();
    const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void { 
      console.log("output connection event test", connection_event);
    };
    const _onmidicb = function (midi_event: MIDIMessageEvent): void {
      console.log("output midi_event data test", midi_event.data);
    };

    for (let i = 0; i < 3; i++) {
      const id = keyGen();
      newMap?.set(id, {
        id: id,
        state: "connected",
        name: "kdjfkjdj",
        type: "output",
        version: "kdfkjdj",
        connection: MIDIPortConnectionState.closed,
        onstatechange: _onstatechangecb,
        onmidimessage: _onmidicb
      } as MIDIOutput);
    }
    return newMap;
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