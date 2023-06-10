import {
    DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE,
    MIDIInputName,
    GenericControlName,
    GenericUIMIDIMappingName,
    DEFAULT_CALLBACK_TABLE,
    UIInterfaceDeviceName,
} from "../constants";
import { ToolkitDispatch } from "../store/store";
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
    () => void
>;

export class MIDIMappingPreference<N extends MIDIInputName> {
    public name: N;
    public mapping: MIDIMapping<N> = {} as any;
    public callbackMap: CallbackMapping<N> = {} as any;

    public constructor(name: N) {
        this.name = name;

        this._setMIDIMappingBasedOnInputName(name);
        this._setMIDICallbackMapBasedOnInputName(name);
    }

    // TODO:
    private static _generateCallbackBasedOnUIName(
        uiName: UIInterfaceDeviceName,
        callback: (midiIntensity: number) => void
    ): any {
        switch (uiName) {
            case "animDuration":
                break;
            case "animVarCoeff":
                break;
            case "button_1_position":
                break;
            case "button_2_position":
                break;
            case "button_3_position":
                break;
            case "button_4_position":
                break;
            case "button_5_position":
                break;
            case "circleWidth":
                return callback;
            case "hPos":
                break;
            case "vertPos":
                break;
            case "invert":
                break;
            case "resetTimerButton":
                break;
            default:
                return () => void 0;
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
        switch (ret.name) {
            case "TouchOSC Bridge":
                ret.mapping[controlName].channel = channel;
                ret.mapping[controlName].uiName = uiName;
                ret.callbackMap[uiName] = MIDIMappingPreference._generateCallbackBasedOnUIName(
                    uiName,
                    dispatch
                );
                break;
            case "XONE:K2 MIDI":
                break;
        }
        return ret;
    }

    private _setMIDICallbackMapBasedOnInputName(name: N): void {
        switch (name) {
            case "TouchOSC Bridge":
                Object.keys(DEFAULT_CALLBACK_TABLE).forEach((key) => {
                    this.callbackMap = {
                        ...this.callbackMap,
                        [key]: DEFAULT_CALLBACK_TABLE[key],
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
            case "XONE:K2 MIDI": // TODO:
                break;
            default:
                break;
        }
    }
}
