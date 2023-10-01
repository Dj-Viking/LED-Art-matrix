import {
    DEFAULT_CALLBACK_TABLE,
    DEFAULT_KEYBOARD_MAPPING_PREFERENCE_TABLE,
    GenericControlName,
    UIInterfaceDeviceName,
} from "../constants";
import { ToolkitDispatch } from "../store/store";
import { CallbackMapping } from "./MIDIMappingClass";

export type KeyInputName = "keyboard" | "_";

export type KeyChannel = 69;

export type KeyMapping<N extends KeyInputName> = Record<
    GenericControlName<N>,
    {
        uiName: UIInterfaceDeviceName;
        channel: KeyChannel;
    }
>;

/**
 *
 * @example
 * const preference = {
 *     [this.name]: {
 *         mapping: {
 *             [controlName]: {
 *                 uiName: "circleWidth"
 *                 channel: 4
 *             },
 *             // other control names
 *             ["fader_1"]: {
 *                 uiName: "animDuration"
 *                 channel: 0
 *             }
 *         },
 *         callbackMap: {
 *             ["uiName"]: (...args: any[]) => void // (calls dispatch with supplied arguments)
 *         }
 *     },
 * }
 * // look up which callback based on the UI name derived from the midi input's own control name
 *
 * const callbackMap = {
 *     ["circleWidth"]: dispatch(someSlice.someAction(value))
 * };
 *
 * //call the callback like this
 * const uiName = preference[midiname][controlName];
 * callbackMap[uiName]()
 */
export class KeyMappingClass<N extends KeyInputName> {
    public name: KeyInputName = "_";
    public mapping: KeyMapping<N> = {} as any;
    public callbackMap: CallbackMapping = {} as any;
    public constructor(name: N, dispatch: ToolkitDispatch) {
        this.name = name;

        this.#setKeyMappingBasedOnInputName(name);

        KeyMappingClass.setKeyCallbackMapBasedOnKeyInputName(this, dispatch);
    }

    #setKeyMappingBasedOnInputName(name: N): void {
        switch (name) {
            case "keyboard":
                Object.keys(DEFAULT_KEYBOARD_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_KEYBOARD_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            default:
                break;
        }
    }

    public static setKeyCallbackMapBasedOnKeyInputName(
        _this: KeyMappingClass<KeyInputName>,
        dispatch: ToolkitDispatch
    ): void {
        Object.keys(DEFAULT_CALLBACK_TABLE).forEach((uiName) => {
            _this.callbackMap = {
                ..._this.callbackMap,
                [uiName]: KeyMappingClass.generateCallbackBasedOnUIName(uiName, dispatch),
            };
        });
    }

    public static generateCallbackBasedOnUIName<P extends keyof CallbackMapping>(
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): CallbackMapping[P] {
        // TODO: MUSIC PLAYER CONTROLS HERE???
        switch (uiName) {
            case "resetTimerButton":
                return (keyEvent: "keyDown") => {
                    dispatch((_dispatchcb, getState) => {
                        const fn = getState().ledState.resetTimerFn;
                        if (keyEvent === "keyDown") {
                            fn();
                        }
                    });
                };
            default:
                return (_nothing: void) => void 0;
        }
    }
}
