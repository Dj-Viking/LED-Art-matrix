import { GlobalState, ISignTestTokenArgs } from "../types";
import jwt from "jsonwebtoken";
import {
    MIDIAccessRecord,
    MIDIConnectionEvent,
    MIDIController,
    MIDIInput,
    MIDIMessageEvent,
    MIDIOutput,
    MIDIPortConnectionState,
    MIDIPortDeviceState,
    MIDIPortType,
    TestMIDIConnectionEvent,
} from "./MIDIControlClass";
import { MOCK_MIDI_ACCESS_RECORD } from "./mocks";
import * as redux from "react-redux";

const mockedRedux: jest.Mocked<typeof redux> = redux as any;

interface ITestService {
    mockedRedux: jest.Mocked<typeof redux>;
    inputMap: Map<MIDIInput["id"], MIDIInput>;
    outputMap: Map<MIDIOutput["id"], MIDIOutput>;
    makeFakeMIDIInputs: () => Map<MIDIInput["id"], MIDIInput>;
    makeFakeMIDIOutputs: () => Map<MIDIOutput["id"], MIDIOutput>;
    setInputCbs: (
        _onmidicb: (midi_event: MIDIMessageEvent) => void,
        _onstatechangecb: (connection_event: MIDIConnectionEvent) => void
    ) => this;
}
/**
 * helper class for the testing environment
 */
export class TestService implements ITestService {
    public mockedRedux: jest.Mocked<typeof redux> = mockedRedux;
    private _access: MIDIAccessRecord;
    public inputMap = new Map<string, MIDIInput>();
    public inputs = [] as MIDIInput[];
    public outputs = [] as MIDIOutput[];
    public outputMap = new Map<string, MIDIOutput>();

    constructor(access: MIDIAccessRecord) {
        this._access = access;
        if (access.inputs?.size > 0) this.inputMap = access.inputs;
        if (access.outputs?.size > 0) this.outputMap = access.outputs;
        if (this.inputMap?.size > 0) this._setInputArrs();
        this.mockReduxModule();
    }

    /**
     *
     * @param cssDeclaration style object of the selected element from the virtual DOM
     * @returns a simple object as { values: string } with the style values object containing the css rules of the selected element
     */
    public static getStyles(cssDeclaration: CSSStyleDeclaration): Record<"values", CSSStyleDeclaration> {
        let styleValues = {} as Record<"values", any>;
        Object.keys(cssDeclaration).forEach((key) => {
            // console.log("key", key, ":", gifStyleRef[key as keyof CSSStyleDeclaration]);
            // ignoring this type because this _values thing comes from the test itself
            // with whatever the testing library objects that were created
            if (key === ("_values" as any)) {
                styleValues = {
                    ...styleValues,
                    values: cssDeclaration[key],
                };
            }
        });
        return styleValues;
    }

    public mockReduxModule(): void {
        let original: any;
        original = jest.requireActual("react-redux");

        this.mockedRedux = {
            ...original,
            useSelector: jest.fn(),
        };

        jest.mock("react-redux", () => {
            const original = jest.requireActual("react-redux");
            return {
                ...original,
                useSelector: jest.fn(),
            };
        });
    }

    public selectorFnMockImpl(
        mockSelectorFn: jest.Mock<any, any>,
        additionalProps: Record<keyof GlobalState, GlobalState[keyof GlobalState]>
    ): void {
        mockSelectorFn.mockImplementation(() => ({
            ...additionalProps,
        }));
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
    }

    public static createMockMIDIControllerClass(): void {
        jest.mock("./MIDIControlClass.ts", () => {
            const MockMIDIControllerConstructor = function (this: MIDIController): MIDIController {
                //MOCK METHODS AND MEMBER VARIABLES

                const fakeonstatechangefn = (): void => void 0;
                const onstatechangefn = jest.fn().mockImplementation(fakeonstatechangefn);
                // @ts-ignore
                function createFakeInputs(): MIDIInput[] {
                    let arr = [];
                    for (let i = 0; i < 3; i++) {
                        arr.push({
                            id: (Math.random() * 1 + 1000).toString(),
                            manufacturer: "holy bajeebus",
                            name: "XONE:K2 MIDI",
                            type: "input",
                            version: "over 9000",
                            state: "connected",
                            connection: "closed",
                            onmidimessage: function () {
                                return void 0;
                            },
                            onstatechange: function () {
                                return void 0;
                            },
                        });
                    }
                    // @ts-ignore
                    return arr;
                }

                this.online = true;
                // @ts-ignore
                this.inputs = createFakeInputs();
                // @ts-ignore
                this.setInputCbs = function (onmidicb, onstatechangecb) {
                    this.inputs?.forEach((input) => {
                        input.onmidimessage = onmidicb;
                        input.onstatechange = onstatechangecb;
                    });
                    return this;
                };
                // @ts-ignore
                this.setOutputCbs = function () {
                    this.outputs?.forEach((output) => {
                        output.onmidimessage = function () {
                            return void 0;
                        };
                        output.onstatechange = function () {
                            return void 0;
                        };
                    });
                    return this;
                };

                this.getInstance = jest.fn().mockImplementation(() => {
                    return this;
                });
                return this;
            };

            // static members on the function prototype
            MockMIDIControllerConstructor.requestMIDIAccess = async function () {
                return Promise.resolve({
                    ...JSON.parse(JSON.stringify(MOCK_MIDI_ACCESS_RECORD)),
                });
            };

            //MOCK MODULE OF MIDI UTILS FILE
            // module to mock returned object NOTE - make sure to mock all modules being exported individually!
            return {
                MIDIPort: { open: () => Promise.resolve({}) },
                MIDIPortType: { type: "input" },
                MIDIConnectionEvent: {},
                MIDIPortDeviceState: { connected: "connected" },
                MIDIPortConnectionState: { closed: "closed" },
                MIDIController: MockMIDIControllerConstructor,
            };
        });
    }

    public makeFakeMIDIInputs(): Map<MIDIInput["id"], MIDIInput> {
        let newMap = new Map<MIDIInput["id"], MIDIInput>();
        const _onmidicb = function (midi_event: MIDIMessageEvent): void {
            console.log("midi input event data test", midi_event.data);
        };
        const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
            console.log("midi input connection event test", connection_event);
        };

        for (let i = 0; i < 1; i++) {
            newMap?.set(i.toString(), {
                id: i.toString(),
                manufacturer: "holy bajeebus",
                name: "XONE:K2 MIDI",
                type: MIDIPortType.input,
                version: "over 9000",
                state: MIDIPortDeviceState.connected,
                connection: MIDIPortConnectionState.closed,
                onmidimessage: _onmidicb,
                onstatechange: _onstatechangecb,
            } as MIDIInput);
        }
        return newMap;
    }

    public makeFakeMIDIOutputs(): Map<MIDIOutput["id"], MIDIOutput> {
        const newMap = new Map<MIDIOutput["id"], MIDIOutput>();
        const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
            console.log("output connection event test", connection_event);
        };
        const _onmidicb = function (midi_event: MIDIMessageEvent): void {
            console.log("output midi_event data test", midi_event.data);
        };

        for (let i = 0; i < 1; i++) {
            newMap?.set(i.toString(), {
                id: i.toString(),
                state: MIDIPortDeviceState.connected,
                name: "kdjfkjdj",
                type: MIDIPortType.output,
                version: "kdfkjdj",
                connection: MIDIPortConnectionState.closed,
                onstatechange: _onstatechangecb,
                onmidimessage: _onmidicb,
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
    public createMIDIMessageEvent(): MIDIMessageEvent {
        return {
            isTrusted: true,
            bubbles: true,
            cancelBubble: false,
            composed: false,
            target: this.makeFakeMIDIInputs().get("1") as MIDIInput,
            //@ts-ignore
            data: [190, 16, 113],
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
    public createAccessStateChangeEvent(): MIDIConnectionEvent {
        //@ts-ignore
        return {
            isTrusted: true,
            bubbles: true,
            cancelBubble: false,
            cancelable: true,
            composed: true,
            target: this.getAccess(),
        };
    }

    public _setInputArrs(): this {
        if (this.inputMap.size > 0) {
            const MIDI_INPUT_LIST_SIZE = this.inputMap.size;
            const entries = this.inputMap.entries();

            for (let i = 0; i < MIDI_INPUT_LIST_SIZE; i++) {
                this.inputs?.push(entries.next().value[1]);
            }
        }
        return this;
    }

    /**
     *
     * @returns returns an instance of the class after setting all the input array's callback functions
     */
    public setInputCbs(
        _onmidicb: (midi_event: MIDIMessageEvent) => unknown,
        _onstatechangecb: (connection_event: MIDIConnectionEvent) => unknown
    ): this {
        const input_size = this.inputMap.size;

        for (let i = 0; i < input_size; i++) {
            this.inputs[i].onmidimessage = _onmidicb;
            this.inputs[i].onstatechange = _onstatechangecb;
        }
        return this;
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
            target: this.inputMap.get("1") as MIDIInput,
        };
    }

    public getAccess(): MIDIAccessRecord {
        return this._access;
    }

    public static signTestToken(args: ISignTestTokenArgs): string {
        const { uuid: someUuid, username, email, _id } = args;
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
