import {
    DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE,
    MIDIInputName,
    GenericControlName,
    GenericUIMIDIMappingName,
    DEFAULT_CALLBACK_TABLE,
    UIInterfaceDeviceName,
} from "../constants";
import { artScrollerActions } from "../store/artScrollerSlice";
import { ledActions } from "../store/ledSlice";
import { ToolkitDispatch } from "../store/store";
import { IPresetButton } from "../types";
import { deepCopy } from "./deepCopy";

export type MIDIMapping<N extends MIDIInputName> = Record<
    GenericControlName<N>,
    {
        uiName: GenericUIMIDIMappingName<N>;
        channel: number;
    }
>;
export type CallbackMapping<N extends MIDIInputName> = Record<
    GenericUIMIDIMappingName<N>,
    (midiIntensity: number, buttonIds?: Array<IPresetButton["id"]>) => void
>;

/**
 * TODO
 * restructure mapping preference table like this - a table of tables
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
 *             ["uiName"]: () => void (calls dispatch with supplied arguments)
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
export class MIDIMappingPreference<N extends MIDIInputName> {
    public name: N;
    public mapping: MIDIMapping<N> = {} as any;
    public callbackMap: CallbackMapping<N> = {} as any;

    public constructor(name: N, dispatch: ToolkitDispatch) {
        this.name = name;

        this._setMIDIMappingBasedOnInputName(name);
        this._setMIDICallbackMapBasedOnInputName(name, dispatch);
        // TODO: since functions can't be serialized into JSON for local storage
        // will have to regenerate the callbacks based on which controlName object is mapped to a particular UI interface names
    }

    // TODO:
    private static _generateCallbackBasedOnUIName<P extends keyof CallbackMapping<MIDIInputName>>(
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): CallbackMapping<MIDIInputName>[P] {
        switch (uiName) {
            case "animDuration":
                return (_midiIntensity: number) => {
                    // TODO: NOT IMPLEMENTED
                };
            case "animVarCoeff":
                return (midiIntensity: number) => {
                    dispatch(ledActions.setAnimVarCoeff(midiIntensity.toString()));
                };
            case "button_1_position":
                return (_midiIntensity: number, _buttonIds?: Array<IPresetButton["id"]>) => {
                    // TODO: not implemented
                };
            case "button_2_position":
                return (_midiIntensity: number, _buttonIds?: Array<IPresetButton["id"]>) => {
                    // TODO: not implemented
                };
            case "button_3_position":
                return (_midiIntensity: number, _buttonIds?: Array<IPresetButton["id"]>) => {
                    // TODO: not implemented
                };
            case "button_4_position":
                return (_midiIntensity: number, _buttonIds?: Array<IPresetButton["id"]>) => {
                    // TODO: not implemented
                };
            case "button_5_position":
                return (_midiIntensity: number, _buttonIds?: Array<IPresetButton["id"]>) => {
                    // TODO: not implemented
                };
            case "circleWidth":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "circleWidth",
                            value: midiIntensity.toString(),
                        })
                    );
                };
            case "hPos":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "hPos",
                            value: midiIntensity.toString(),
                        })
                    );
                };
            case "vertPos":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "vertPos",
                            value: midiIntensity.toString(),
                        })
                    );
                };
            case "invert":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "invert",
                            value: midiIntensity.toString(),
                        })
                    );
                };
            case "resetTimerButton":
                return (midiIntensity: number) => {
                    // only on button down trigger action
                    if (midiIntensity === 127) {
                        dispatch((_dispatchcb, getState) => {
                            getState().ledState.resetTimerFn();
                        });
                    }
                };
            default:
                return (_midiIntensity: number) => void 0;
        }
    }

    public static updatePreferenceMapping(
        _this: MIDIMappingPreference<typeof name>,
        name: MIDIInputName,
        controlName: GenericControlName<typeof name>,
        channel: number,
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): MIDIMappingPreference<typeof name> {
        // update this.mapping and this.callbackmap

        const ret = deepCopy(_this);
        ret.mapping[controlName].channel = channel;
        ret.mapping[controlName].uiName = uiName;
        ret.callbackMap[uiName] = MIDIMappingPreference._generateCallbackBasedOnUIName(
            uiName,
            dispatch
        );

        // TODO: update storage preference too?
        // but can't store the callback map...only the mapping itself

        return ret;
    }

    private _setMIDICallbackMapBasedOnInputName(name: N, dispatch: ToolkitDispatch): void {
        switch (name) {
            case "TouchOSC Bridge":
                Object.keys(DEFAULT_CALLBACK_TABLE).forEach((uiName) => {
                    this.callbackMap = {
                        ...this.callbackMap,
                        [uiName]: MIDIMappingPreference._generateCallbackBasedOnUIName(
                            uiName,
                            dispatch
                        ),
                    };
                });
                break;
            default:
                break;
        }
    }

    private _setMIDIMappingBasedOnInputName(name: N): void {
        switch (name) {
            case "TouchOSC Bridge":
                Object.keys(DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            case "XONE:K2 MIDI":
                // Object.keys();
                break;
            default:
                break;
        }
    }
}