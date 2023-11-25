/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    DEFAULT_CALLBACK_TABLE,
    DEFAULT_KEYBOARD_MAPPING_PREFERENCE_TABLE,
    GenericControlName,
    UIInterfaceDeviceName,
} from "../constants";
import { keyboardActions } from "../store/keyboardSlice";
import { ToolkitDispatch } from "../store/store";
import { CallbackMapping } from "./MIDIMappingClass";

export type KeyInputName = "keyboard";

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
 *             ["a"]: {
 *                 uiName: "circleWidth"
 *                 channel: 4
 *             },
 *             // other control names
 *             ["b"]: {
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
    public name: KeyInputName = "keyboard";
    public mapping: KeyMapping<N> = {} as any;
    public callbackMap: CallbackMapping = {} as any;
    public constructor(name: N, dispatch: ToolkitDispatch) {
        this.name = name;

        this.#setKeyMappingBasedOnInputName(name);

        KeyMappingClass.setKeyCallbackMapBasedOnKeyInputName(this, dispatch);

        this._initLocalStoragePreferencesIfNotExists(dispatch);
    }

    public static listeningForEditsHandler(dispatch: ToolkitDispatch, uiName: UIInterfaceDeviceName): void {
        console.log("listening for edits on keyboard preference mapping");
        dispatch(keyboardActions.setIsListeningForEdits(true));
        dispatch(
            keyboardActions.setMappingEditOptions({
                uiName: uiName,
            })
        );
    }

    public static getControlNameFromControllerInUseMapping(
        mappingInUse: KeyMapping<KeyInputName>,
        uiName: UIInterfaceDeviceName
    ): string {
        let ret = "";

        for (const controlName of Object.keys(mappingInUse)) {
            if (uiName === mappingInUse[controlName].uiName) {
                //
                ret = controlName;
            } else {
                ret = "unknown key controlName mapping";
            }
        }

        return ret;
    }

    // for each new midi controller to support this has to be expanded
    private _initLocalStoragePreferencesIfNotExists(dispatch: ToolkitDispatch): void {
        let pref = null;
        // unfortunately functions are not serializable to JSON in local storage
        if (!window.localStorage.getItem("keyboard" as KeyInputName)) {
            // create
            const initPref = new KeyMappingClass("keyboard", dispatch);
            pref = initPref;
            console.log("pref to initialize into local storage", pref);
            window.localStorage.setItem("keyboard" as KeyInputName, JSON.stringify(initPref));
            const gotPref = window.localStorage.getItem("keyboard")!;
            console.log("got pref from local storage", JSON.parse(gotPref));
        }
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
                return (eventType: "keyDown") => {
                    dispatch((_dispatchcb, getState) => {
                        const fn = getState().ledState.resetTimerFn;
                        if (eventType === "keyDown") {
                            fn();
                        }
                    });
                };
            default:
                return (_nothing: void) => void 0;
        }
    }
}
